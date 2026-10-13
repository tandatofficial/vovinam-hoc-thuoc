import SwiftUI

/// Hệ thống thiết kế (Design System) chuẩn hóa cho Vovinam Học Thuộc
public enum AppTheme {
    // MARK: - Màu sắc thương hiệu Võ Đạo
    public enum Colors {
        /// Xanh dương chủ đạo Vovinam
        public static let primary = Color(red: 0.08, green: 0.38, blue: 0.78)
        public static let primaryDark = Color(red: 0.05, green: 0.25, blue: 0.55)
        public static let primaryLight = Color(red: 0.90, green: 0.95, blue: 1.0)

        /// Trạng thái học tập
        public static let mastered = Color(red: 0.13, green: 0.65, blue: 0.36)      // Xanh lá (2 điểm)
        public static let masteredBg = Color(red: 0.13, green: 0.65, blue: 0.36).opacity(0.12)
        
        public static let learning = Color(red: 0.94, green: 0.55, blue: 0.15)      // Cam (1 điểm)
        public static let learningBg = Color(red: 0.94, green: 0.55, blue: 0.15).opacity(0.12)
        
        public static let unlearned = Color(red: 0.90, green: 0.22, blue: 0.22)     // Đỏ (0 điểm)
        public static let unlearnedBg = Color(red: 0.90, green: 0.22, blue: 0.22).opacity(0.12)

        public static let gold = Color(red: 0.98, green: 0.75, blue: 0.10)          // Vàng ghim sao
        
        /// Nền và khung viền
        public static let cardBackground = Color(.systemBackground)
        public static let secondaryCardBackground = Color(.secondarySystemBackground)
        public static let border = Color(.systemGray5)
    }

    // MARK: - Bo góc chuẩn
    public enum CornerRadius {
        public static let small: CGFloat = 8
        public static let medium: CGFloat = 12
        public static let large: CGFloat = 16
        public static let extraLarge: CGFloat = 20
    }

    // MARK: - Đổ bóng giao diện
    public enum Shadow {
        public static let soft = ShadowStyle(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 3)
        public static let elevated = ShadowStyle(color: Color.black.opacity(0.08), radius: 10, x: 0, y: 5)
    }

    public struct ShadowStyle {
        public let color: Color
        public let radius: CGFloat
        public let x: CGFloat
        public let y: CGFloat
    }
}

// MARK: - View Modifiers tiện ích
public extension View {
    func appCardStyle(
        backgroundColor: Color = AppTheme.Colors.cardBackground,
        cornerRadius: CGFloat = AppTheme.CornerRadius.large,
        shadow: AppTheme.ShadowStyle = AppTheme.Shadow.soft
    ) -> some View {
        self
            .background(backgroundColor)
            .cornerRadius(cornerRadius)
            .shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }

    func tactilePress() -> some View {
        self.buttonStyle(TactileButtonStyle())
    }
}

public struct TactileButtonStyle: ButtonStyle {
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .opacity(configuration.isPressed ? 0.9 : 1.0)
            .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
    }
}
