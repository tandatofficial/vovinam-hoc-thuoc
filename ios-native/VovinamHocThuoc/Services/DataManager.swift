import Foundation

public final class DataManager {
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
        // 1. Thử nạp từ Documents directory (người dùng đã sửa / đã lưu)
        if FileManager.default.fileExists(atPath: questionsFileURL.path) {
            do {
                let data = try Data(contentsOf: questionsFileURL)
                let decoded = try JSONDecoder().decode([Question].self, from: data)
                if !decoded.isEmpty {
                    return decoded
                }
            } catch {
                print("Error loading questions from Documents: \(error)")
            }
        }

        // 2. Fallback nạp từ Bundle resource
        return loadBundledQuestions()
    }

    public func loadBundledQuestions() -> [Question] {
        guard let url = Bundle.main.url(forResource: "questions", withExtension: "json") else {
            print("questions.json not found in main bundle")
            return []
        }

        do {
            let data = try Data(contentsOf: url)
            let decoded = try JSONDecoder().decode([Question].self, from: data)
            // Lưu ngay vào Documents để cho phép chỉnh sửa động
            saveQuestions(decoded)
            return decoded
        } catch {
            print("Error decoding bundled questions: \(error)")
            return []
        }
    }

    public func saveQuestions(_ questions: [Question]) {
        do {
            let data = try JSONEncoder().encode(questions)
            try data.write(to: questionsFileURL, options: [.atomicWrite])
        } catch {
            print("Error saving questions to Documents: \(error)")
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
                print("Error loading day plan from Documents: \(error)")
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
            print("Error saving day plan: \(error)")
        }
    }

    // MARK: - Current Day & Streak

    public func loadCurrentDay() -> Int {
        let saved = UserDefaults.standard.integer(forKey: currentDayKey)
        return saved > 0 ? saved : 3
    }

    public func saveCurrentDay(_ day: Int) {
        UserDefaults.standard.set(day, forKey: currentDayKey)
    }

    public func loadStreakDays() -> Int {
        let saved = UserDefaults.standard.integer(forKey: streakDaysKey)
        return saved > 0 ? saved : 3
    }

    public func saveStreakDays(_ streak: Int) {
        UserDefaults.standard.set(streak, forKey: streakDaysKey)
    }

    // MARK: - Reset All Data (Nút đặt lại hoạt động 100%)

    public func resetAllData() -> (questions: [Question], day: Int, streak: Int) {
        // 1. Xóa file documents
        try? FileManager.default.removeItem(at: questionsFileURL)
        try? FileManager.default.removeItem(at: dayPlanFileURL)

        // 2. Xóa UserDefaults
        UserDefaults.standard.removeObject(forKey: currentDayKey)
        UserDefaults.standard.removeObject(forKey: streakDaysKey)
        UserDefaults.standard.synchronize()

        // 3. Nạp lại bản gốc từ Bundle
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

    // MARK: - Import / Export JSON (Không bao giờ bị hardcode)

    public func exportQuestionsJSON() -> String? {
        guard let data = try? Data(contentsOf: questionsFileURL) else { return nil }
        return String(data: data, encoding: .utf8)
    }

    public func importQuestionsJSON(_ jsonString: String) -> Bool {
        guard let data = jsonString.data(using: .utf8) else { return false }
        do {
            let decoded = try JSONDecoder().decode([Question].self, from: data)
            saveQuestions(decoded)
            return true
        } catch {
            print("Failed to import JSON: \(error)")
            return false
        }
    }
}
