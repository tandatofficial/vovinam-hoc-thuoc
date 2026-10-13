import SwiftUI

/// Huy hiệu hiển thị điểm số và trạng thái học (Chưa thuộc, Mang máng, Thuộc làu)
public struct ScoreBadgeView: View {
    public let score: Int
    public var style: BadgeStyle = .standard

    public enum BadgeStyle {
        case standard      // "Thuộc làu", "Mang máng", "Chưa thuộc"
        case pointOnly     // "2đ", "1đ", "0đ"
        case compact       // Chấm tròn kèm màu
    }

    public init(score: Int, style: BadgeStyle = .standard) {
        self.score = score
        self.style = style
    }

    private var title: String {
        switch style {
        case .standard:
            switch score {
            case 2: return "Thuộc làu"
            case 1: return "Mang máng"
            default: return "Chưa thuộc"
            }
        case .pointOnly:
            return "\(score)đ"
        case .compact:
            return ""
        }
    }

    private var textColor: Color {
        switch score {
        case 2: return AppTheme.Colors.mastered
        case 1: return AppTheme.Colors.learning
        default: return AppTheme.Colors.unlearned
        }
    }

    private var backgroundColor: Color {
        switch score {
        case 2: return AppTheme.Colors.masteredBg
        case 1: return AppTheme.Colors.learningBg
        default: return AppTheme.Colors.unlearnedBg
        }
    }

    public var body: some View {
        if style == .compact {
            Circle()
                .fill(textColor)
                .frame(width: 8, height: 8)
        } else {
            Text(title)
                .font(.caption2.weight(.bold))
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(backgroundColor)
                .foregroundColor(textColor)
                .cornerRadius(AppTheme.CornerRadius.small)
        }
    }
}
