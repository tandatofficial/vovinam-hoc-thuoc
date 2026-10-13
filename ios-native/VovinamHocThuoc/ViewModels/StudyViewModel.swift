import Foundation
import SwiftUI
import Combine

public enum StudySubMode: String, CaseIterable, Identifiable {
    case overview = "Tổng quan"
    case chunk = "Học từng đoạn"
    case cloze = "Điền từ khuyết"
    case checklist = "Checklist ý"

    public var id: String { rawValue }

    public var iconName: String {
        switch self {
        case .overview: return "book.closed"
        case .chunk: return "square.split.1x2"
        case .cloze: return "character.cursor.ibeam"
        case .checklist: return "checklist"
        }
    }
}

public enum AnswerTabType: String, CaseIterable {
    case easy = "Dễ học & Mẹo nhớ"
    case full = "Nguyên văn chi tiết"
}

@MainActor
public final class StudyViewModel: ObservableObject {
    public static let shared = StudyViewModel()

    @Published public var questions: [Question] = []
    @Published public var currentDay: Int = 3
    @Published public var streakDays: Int = 3
    @Published public var selectedQuestionId: Int = 1
    @Published public var selectedSubMode: StudySubMode = .overview
    @Published public var currentAnswerTab: AnswerTabType = .easy
    @Published public var isAnswerRevealed: Bool = true
    @Published public var isHintExpanded: Bool = true
    @Published public var showResetModal: Bool = false
    @Published public var showImportExportSheet: Bool = false
    @Published public var toastMessage: String?

    private let dataManager = DataManager.shared

    public init() {
        loadData()
    }

    public func loadData() {
        self.questions = dataManager.loadQuestions()
        self.currentDay = dataManager.loadCurrentDay()
        self.streakDays = dataManager.loadStreakDays()

        if let first = questions.first {
            self.selectedQuestionId = first.id
        }
    }

    public var currentQuestion: Question {
        questions.first(where: { $0.id == selectedQuestionId }) ?? questions.first ?? Question(
            id: 1, number: 1, title: "Lỗi", category: "", status: "unlearned", score: 0,
            dayAssigned: 1, keywords: "", hintWords: "",
            easyAnswer: EasyAnswer(headlineQuote: "", coreMeaning: "", mnemonic: ""),
            fullAnswer: FullAnswer(intro: "", quote: nil, paragraphs: [], bulletPoints: nil)
        )
    }

    public var currentIndex: Int {
        questions.firstIndex(where: { $0.id == selectedQuestionId }) ?? 0
    }

    // MARK: - Progress Calculations

    public var masteredCount: Int {
        questions.filter { $0.score == 2 }.count
    }

    public var learningCount: Int {
        questions.filter { $0.score == 1 }.count
    }

    public var forgotCount: Int {
        questions.filter { $0.score == 0 }.count
    }

    public var averageScore: Double {
        guard !questions.isEmpty else { return 0 }
        let total = questions.reduce(0) { $0 + $1.score }
        return Double(total) / Double(questions.count * 2) * 10.0
    }

    public var progressPercent: Int {
        guard !questions.isEmpty else { return 0 }
        return Int(Double(masteredCount) / Double(questions.count) * 100.0)
    }

    public var mistakeQuestions: [Question] {
        questions.filter { $0.score == 0 || ($0.isBookmarked ?? false) }
    }

    // MARK: - User Actions

    public func selectQuestion(id: Int) {
        SpeechService.shared.stop()
        selectedQuestionId = id
        isAnswerRevealed = true
        isHintExpanded = false
        currentAnswerTab = .easy
    }

    public func nextQuestion() {
        SpeechService.shared.stop()
        if currentIndex < questions.count - 1 {
            selectQuestion(id: questions[currentIndex + 1].id)
        } else if let first = questions.first {
            selectQuestion(id: first.id)
        }
    }

    public func previousQuestion() {
        SpeechService.shared.stop()
        if currentIndex > 0 {
            selectQuestion(id: questions[currentIndex - 1].id)
        }
    }

    public func updateScore(questionId: Int, score: Int) {
        guard let index = questions.firstIndex(where: { $0.id == questionId }) else { return }
        questions[index].score = score

        switch score {
        case 2:
            questions[index].status = "mastered"
        case 1:
            questions[index].status = "learning"
        default:
            questions[index].status = "unlearned"
        }

        questions[index].lastReviewedTimestamp = Date().timeIntervalSince1970
        dataManager.saveQuestions(questions)
    }

    public func toggleBookmark(questionId: Int) {
        guard let index = questions.firstIndex(where: { $0.id == questionId }) else { return }
        let current = questions[index].isBookmarked ?? false
        questions[index].isBookmarked = !current
        dataManager.saveQuestions(questions)
    }

    public func setCurrentDay(_ day: Int) {
        self.currentDay = day
        dataManager.saveCurrentDay(day)
    }

    // MARK: - Reset All Progress (100% Functional & Reactive)

    public func resetAllProgress() {
        SpeechService.shared.stop()
        let result = dataManager.resetAllData()
        self.questions = result.questions
        self.currentDay = result.day
        self.streakDays = result.streak
        if let first = result.questions.first {
            self.selectedQuestionId = first.id
        }
        self.isAnswerRevealed = true
        self.isHintExpanded = true
        self.currentAnswerTab = .easy
        showToast("Đã đặt lại toàn bộ tiến độ học tập thành công!")
    }

    // MARK: - Import / Export JSON (Không bao giờ bị hardcode)

    public func importQuestions(from jsonString: String) -> Bool {
        if dataManager.importQuestionsJSON(jsonString) {
            loadData()
            showToast("Đã nạp câu hỏi mới thành công!")
            return true
        }
        showToast("Lỗi: Dữ liệu JSON không hợp lệ!")
        return false
    }

    public func exportQuestions() -> String {
        return dataManager.exportQuestionsJSON() ?? ""
    }

    public func showToast(_ msg: String) {
        self.toastMessage = msg
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            if self.toastMessage == msg {
                self.toastMessage = nil
            }
        }
    }
}
