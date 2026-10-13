import Foundation

public struct ClozeItem: Codable, Identifiable, Equatable {
    public var id: String { prompt }
    public let prompt: String
    public let answers: [String]
    public let distractors: [String]
}

public struct BulletPoint: Codable, Equatable {
    public let label: String
    public let text: String
    public let color: String?
}

public struct EasyAnswer: Codable, Equatable {
    public let headlineQuote: String
    public let coreMeaning: String
    public let mnemonic: String
}

public struct FullAnswer: Codable, Equatable {
    public let intro: String
    public let quote: String?
    public let paragraphs: [String]
    public let bulletPoints: [BulletPoint]?
}

public struct Question: Identifiable, Codable, Equatable {
    public let id: Int
    public let number: Int
    public var title: String
    public var category: String
    public var status: String // "mastered" | "learning" | "review" | "unlearned"
    public var score: Int     // 0 = Quên, 1 = Nhớ mang máng, 2 = Thuộc làu
    public var dayAssigned: Int
    public var keywords: String
    public var hintWords: String
    public var easyAnswer: EasyAnswer
    public var fullAnswer: FullAnswer
    public var accuracyPercent: Int?
    public var readCount: Int?
    public var chunks: [String]?
    public var clozeData: [ClozeItem]?
    public var keyPoints: [String]?
    public var commonMistakes: [String]?
    public var userNote: String?
    public var isBookmarked: Bool?
    public var lastReviewedTimestamp: TimeInterval?

    public var isMarkedFavorite: Bool {
        return isBookmarked ?? false
    }
}

public struct DayPlanItem: Identifiable, Codable, Equatable {
    public var id: Int { day }
    public let day: Int
    public let label: String
    public let focus: String
    public let description: String
    public let assignedQuestionIds: [Int]
    public var isCompleted: Bool
    public var isToday: Bool
    public var isExamDay: Bool?
}
