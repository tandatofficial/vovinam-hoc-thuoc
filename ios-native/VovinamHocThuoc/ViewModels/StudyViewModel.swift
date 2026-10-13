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

public final class StudyViewModel: ObservableObject {
    public static let shared = StudyViewModel()

    // MARK: - Published States
    @Published public var questions: [Question] = []
    @Published public var currentDay: Int = 1
    @Published public var streakDays: Int = 1
    @Published public var selectedQuestionId: Int = 1
    @Published public var selectedSubMode: StudySubMode = .overview
    @Published public var currentAnswerTab: AnswerTabType = .easy
    @Published public var isAnswerRevealed: Bool = true
    @Published public var isHintExpanded: Bool = true
    @Published public var toastMessage: String?

    // MARK: - Dependencies
    private let dataManager: DataManagerProtocol
    private let speechService: SpeechServiceProtocol

    public init(
        dataManager: DataManagerProtocol = DataManager.shared,
        speechService: SpeechServiceProtocol = SpeechService.shared
    ) {
        self.dataManager = dataManager
        self.speechService = speechService
        loadData()
    }

    public func loadData() {
        self.questions = dataManager.loadQuestions()
        self.currentDay = dataManager.loadCurrentDay()
        self.streakDays = dataManager.loadStreakDays()

        if let first = questions.first, !questions.contains(where: { $0.id == selectedQuestionId }) {
            self.selectedQuestionId = first.id
        }
    }

    // MARK: - Current Selection Properties

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

    // MARK: - Computed Analytics & Statistics

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

    // MARK: - Navigation Actions

    public func selectQuestion(id: Int) {
        speechService.stop()
        selectedQuestionId = id
        isAnswerRevealed = true
        isHintExpanded = false
        currentAnswerTab = .easy
    }

    public func nextQuestion() {
        speechService.stop()
        if currentIndex < questions.count - 1 {
            selectQuestion(id: questions[currentIndex + 1].id)
        } else if let first = questions.first {
            selectQuestion(id: first.id)
        }
    }

    public func previousQuestion() {
        speechService.stop()
        if currentIndex > 0 {
            selectQuestion(id: questions[currentIndex - 1].id)
        }
    }

    // MARK: - Assessment & Study Actions

    public func updateScore(questionId: Int, score: Int) {
        guard let index = questions.firstIndex(where: { $0.id == questionId }) else { return }
        let boundedScore = max(0, min(2, score))
        questions[index].score = boundedScore

        switch boundedScore {
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
        self.currentDay = max(1, min(10, day))
        dataManager.saveCurrentDay(self.currentDay)
    }

    // MARK: - Reset All Progress (100% Reactive)

    public func resetAllProgress() {
        speechService.stop()
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

    // MARK: - Dynamic Import / Export JSON

    public func importQuestions(from jsonString: String) -> Bool {
        let result = dataManager.importQuestionsJSON(jsonString)
        switch result {
        case .success(let count):
            loadData()
            showToast("Đã nạp thành công \(count) câu hỏi mới!")
            return true
        case .failure(let error):
            showToast("Lỗi nhập dữ liệu: \(error.localizedDescription)")
            return false
        }
    }

    public func exportQuestions() -> String {
        return dataManager.exportQuestionsJSON() ?? ""
    }

    // MARK: - User Feedback Toast

    public func showToast(_ msg: String) {
        self.toastMessage = msg
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) { [weak self] in
            guard let self = self else { return }
            if self.toastMessage == msg {
                self.toastMessage = nil
            }
        }
    }
}
