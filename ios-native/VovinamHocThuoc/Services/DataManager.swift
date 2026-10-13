import Foundation

/// Protocol định nghĩa tầng lưu trữ dữ liệu câu hỏi và tiến độ
public protocol DataManagerProtocol {
    func loadQuestions() -> [Question]
    func saveQuestions(_ questions: [Question])
    func loadDayPlan() -> [DayPlanItem]
    func saveDayPlan(_ plan: [DayPlanItem])
    func loadCurrentDay() -> Int
    func saveCurrentDay(_ day: Int)
    func loadStreakDays() -> Int
    func saveStreakDays(_ streak: Int)
    func resetAllData() -> (questions: [Question], day: Int, streak: Int)
    func exportQuestionsJSON() -> String?
    func importQuestionsJSON(_ jsonString: String) -> Result<Int, DataError>
}

public enum DataError: LocalizedError {
    case invalidEncoding
    case decodingFailed(String)
    case emptyData
    case invalidQuestionStructure(String)
    case fileWriteFailed

    public var errorDescription: String? {
        switch self {
        case .invalidEncoding:
            return "Chuỗi ký tự không đúng định dạng UTF-8."
        case .decodingFailed(let reason):
            return "Lỗi phân tích cú pháp JSON: \(reason)"
        case .emptyData:
            return "Dữ liệu JSON rỗng, không chứa câu hỏi nào."
        case .invalidQuestionStructure(let field):
            return "Dữ liệu câu hỏi bị thiếu trường bắt buộc: \(field)"
        case .fileWriteFailed:
            return "Không thể ghi tệp vào bộ nhớ thiết bị."
        }
    }
}

public final class DataManager: DataManagerProtocol {
    public static let shared = DataManager()

    private let questionsFileName = "vovinam_questions_v1.json"
    private let dayPlanFileName = "vovinam_day_plan_v1.json"
    private let currentDayKey = "vovinam_current_day"
    private let streakDaysKey = "vovinam_streak_days"

    private var documentsDirectory: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    private var questionsFileURL: URL {
        documentsDirectory.appendingPathComponent(questionsFileName)
    }

    private var dayPlanFileURL: URL {
        documentsDirectory.appendingPathComponent(dayPlanFileName)
    }

    private init() {}

    // MARK: - Questions Persistence (Dynamic JSON)

    public func loadQuestions() -> [Question] {
        // 1. Thử nạp từ Documents directory (bản đã lưu động của người dùng)
        if FileManager.default.fileExists(atPath: questionsFileURL.path) {
            do {
                let data = try Data(contentsOf: questionsFileURL)
                let decoded = try JSONDecoder().decode([Question].self, from: data)
                if !decoded.isEmpty {
                    return decoded
                }
            } catch {
                print("[DataManager] Lỗi đọc từ Documents, sử dụng fallback Bundle: \(error)")
            }
        }

        // 2. Fallback nạp từ Bundle resource
        return loadBundledQuestions()
    }

    public func loadBundledQuestions() -> [Question] {
        guard let url = Bundle.main.url(forResource: "questions", withExtension: "json") else {
            print("[DataManager] Không tìm thấy questions.json trong Bundle")
            return []
        }

        do {
            let data = try Data(contentsOf: url)
            let decoded = try JSONDecoder().decode([Question].self, from: data)
            // Lưu ngay vào Documents để cho phép chỉnh sửa động về sau
            saveQuestions(decoded)
            return decoded
        } catch {
            print("[DataManager] Lỗi giải mã questions.json trong Bundle: \(error)")
            return []
        }
    }

    public func saveQuestions(_ questions: [Question]) {
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
            let data = try encoder.encode(questions)
            try data.write(to: questionsFileURL, options: [.atomicWrite])
        } catch {
            print("[DataManager] Lỗi lưu câu hỏi: \(error)")
        }
    }

    // MARK: - Day Plan Persistence

    public func loadDayPlan() -> [DayPlanItem] {
        if FileManager.default.fileExists(atPath: dayPlanFileURL.path) {
            do {
                let data = try Data(contentsOf: dayPlanFileURL)
                let decoded = try JSONDecoder().decode([DayPlanItem].self, from: data)
                if !decoded.isEmpty {
                    return decoded
                }
            } catch {
                print("[DataManager] Lỗi tải day plan: \(error)")
            }
        }

        guard let url = Bundle.main.url(forResource: "day_plan", withExtension: "json") else {
            return []
        }

        do {
            let data = try Data(contentsOf: url)
            let decoded = try JSONDecoder().decode([DayPlanItem].self, from: data)
            saveDayPlan(decoded)
            return decoded
        } catch {
            return []
        }
    }

    public func saveDayPlan(_ plan: [DayPlanItem]) {
        do {
            let data = try JSONEncoder().encode(plan)
            try data.write(to: dayPlanFileURL, options: [.atomicWrite])
        } catch {
            print("[DataManager] Lỗi ghi day plan: \(error)")
        }
    }

    // MARK: - Current Day & Streak

    public func loadCurrentDay() -> Int {
        let saved = UserDefaults.standard.integer(forKey: currentDayKey)
        return saved > 0 ? saved : 1
    }

    public func saveCurrentDay(_ day: Int) {
        UserDefaults.standard.set(day, forKey: currentDayKey)
    }

    public func loadStreakDays() -> Int {
        let saved = UserDefaults.standard.integer(forKey: streakDaysKey)
        return saved > 0 ? saved : 1
    }

    public func saveStreakDays(_ streak: Int) {
        UserDefaults.standard.set(streak, forKey: streakDaysKey)
    }

    // MARK: - Reset All Data (Reactive & 100% Hoạt Động)

    public func resetAllData() -> (questions: [Question], day: Int, streak: Int) {
        // 1. Dọn sạch file tệp Documents
        try? FileManager.default.removeItem(at: questionsFileURL)
        try? FileManager.default.removeItem(at: dayPlanFileURL)

        // 2. Làm mới cấu hình UserDefaults
        UserDefaults.standard.removeObject(forKey: currentDayKey)
        UserDefaults.standard.removeObject(forKey: streakDaysKey)
        UserDefaults.standard.synchronize()

        // 3. Khôi phục 10 câu hỏi nguyên bản từ Bundle với điểm số = 0
        let freshQuestions = loadBundledQuestions().map { q -> Question in
            var copy = q
            copy.score = 0
            copy.status = "unlearned"
            copy.isBookmarked = false
            return copy
        }
        saveQuestions(freshQuestions)

        let initialDay = 1
        let initialStreak = 0
        saveCurrentDay(initialDay)
        saveStreakDays(initialStreak)

        return (freshQuestions, initialDay, initialStreak)
    }

    // MARK: - Dynamic Import / Export JSON

    public func exportQuestionsJSON() -> String? {
        guard let data = try? Data(contentsOf: questionsFileURL) else { return nil }
        return String(data: data, encoding: .utf8)
    }

    public func importQuestionsJSON(_ jsonString: String) -> Result<Int, DataError> {
        guard let data = jsonString.data(using: .utf8) else {
            return .failure(.invalidEncoding)
        }

        do {
            let decoded = try JSONDecoder().decode([Question].self, from: data)
            guard !decoded.isEmpty else {
                return .failure(.emptyData)
            }

            // Kiểm tra tính hợp lệ của từng câu
            for q in decoded {
                if q.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                    return .failure(.invalidQuestionStructure("Tiêu đề câu hỏi số #\(q.number) bị rỗng"))
                }
            }

            saveQuestions(decoded)
            return .success(decoded.count)
        } catch {
            return .failure(.decodingFailed(error.localizedDescription))
        }
    }
}
