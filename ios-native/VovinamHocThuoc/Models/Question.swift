import Foundation

public struct ClozeItem: Codable, Identifiable, Equatable {
    public var id: String { prompt }
    public let prompt: String
    public let answers: [String]
    public var distractors: [String]?

    public init(prompt: String, answers: [String], distractors: [String]? = nil) {
        self.prompt = prompt
        self.answers = answers
        self.distractors = distractors
    }
}

public struct BulletPoint: Codable, Equatable {
    public let label: String
    public let text: String
    public var color: String?

    public init(label: String, text: String, color: String? = nil) {
        self.label = label
        self.text = text
        self.color = color
    }
}

public struct EasyAnswer: Codable, Equatable {
    public let headlineQuote: String
    public let coreMeaning: String
    public let mnemonic: String

    public init(headlineQuote: String, coreMeaning: String, mnemonic: String) {
        self.headlineQuote = headlineQuote
        self.coreMeaning = coreMeaning
        self.mnemonic = mnemonic
    }
}

public struct FullAnswer: Codable, Equatable {
    public let intro: String
    public var quote: String?
    public let paragraphs: [String]
    public var bulletPoints: [BulletPoint]?

    public init(intro: String, quote: String? = nil, paragraphs: [String], bulletPoints: [BulletPoint]? = nil) {
        self.intro = intro
        self.quote = quote
        self.paragraphs = paragraphs
        self.bulletPoints = bulletPoints
    }
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

    public init(
        id: Int,
        number: Int,
        title: String,
        category: String,
        status: String = "unlearned",
        score: Int = 0,
        dayAssigned: Int = 1,
        keywords: String = "",
        hintWords: String = "",
        easyAnswer: EasyAnswer,
        fullAnswer: FullAnswer,
        accuracyPercent: Int? = nil,
        readCount: Int? = nil,
        chunks: [String]? = nil,
        clozeData: [ClozeItem]? = nil,
        keyPoints: [String]? = nil,
        commonMistakes: [String]? = nil,
        userNote: String? = nil,
        isBookmarked: Bool? = nil,
        lastReviewedTimestamp: TimeInterval? = nil
    ) {
        self.id = id
        self.number = number
        self.title = title
        self.category = category
        self.status = status
        self.score = score
        self.dayAssigned = dayAssigned
        self.keywords = keywords
        self.hintWords = hintWords
        self.easyAnswer = easyAnswer
        self.fullAnswer = fullAnswer
        self.accuracyPercent = accuracyPercent
        self.readCount = readCount
        self.chunks = chunks
        self.clozeData = clozeData
        self.keyPoints = keyPoints
        self.commonMistakes = commonMistakes
        self.userNote = userNote
        self.isBookmarked = isBookmarked
        self.lastReviewedTimestamp = lastReviewedTimestamp
    }

    public var isMarkedFavorite: Bool {
        return isBookmarked ?? false
    }

    public var clozeItems: [ClozeItem]? {
        return clozeData
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
