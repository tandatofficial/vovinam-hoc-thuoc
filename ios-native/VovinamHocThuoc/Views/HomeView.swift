import SwiftUI

public struct HomeView: View {
    @ObservedObject public var viewModel: StudyViewModel
    @Binding public var selectedTab: Int

    @State private var showingResetAlert: Bool = false

    public init(viewModel: StudyViewModel, selectedTab: Binding<Int>) {
        self.viewModel = viewModel
        self._selectedTab = selectedTab
    }

    public var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // MARK: - Banner Tiến Độ Lộ Trình 10 Ngày
                    heroRoadmapBanner

                    // MARK: - Bộ 3 Chỉ Số Phản Xạ
                    statsRow

                    // MARK: - Danh Sách 10 Câu Hỏi Nhanh
                    quickQuestionsSection

                    // MARK: - Nút Đặt Lại Toàn Bộ Tiến Độ (100% Hoạt Động)
                    resetProgressButton
                }
                .padding(.top, 8)
            }
            .navigationTitle("Võ 3 — 10 Ngày")
            .navigationBarTitleDisplayMode(.inline)
            .alert(isPresented: $showingResetAlert) {
                Alert(
                    title: Text("Xác nhận đặt lại tiến độ"),
                    message: Text("Toàn bộ điểm đánh giá, danh sách câu đã thuộc và ngày học sẽ được làm mới về ban đầu. Bạn có chắc chắn muốn đặt lại?"),
                    primaryButton: .destructive(Text("Đặt lại ngay")) {
                        viewModel.resetAllProgress()
                    },
                    secondaryButton: .cancel(Text("Hủy"))
                )
            }
        }
    }

    // MARK: - Subviews

    private var heroRoadmapBanner: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("LỘ TRÌNH CẤP TỐC")
                        .font(.caption2.weight(.black))
                        .foregroundColor(.white.opacity(0.85))
                        .tracking(1)

                    Text("Ngày \(viewModel.currentDay) / 10 Ngày")
                        .font(.title2.weight(.bold))
                        .foregroundColor(.white)
                }

                Spacer()

                // Chuỗi ngày học liên tục (Streak)
                HStack(spacing: 4) {
                    Image(systemName: "flame.fill")
                        .foregroundColor(.orange)
                    Text("\(viewModel.streakDays) ngày")
                        .font(.subheadline.weight(.bold))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(Color.white.opacity(0.2))
                .cornerRadius(AppTheme.CornerRadius.medium)
            }

            // Thanh tiến độ hoàn thành
            VStack(alignment: .leading, spacing: 4) {
                ProgressView(value: Double(viewModel.masteredCount), total: Double(max(1, viewModel.questions.count)))
                    .tint(.yellow)

                HStack {
                    Text("\(viewModel.masteredCount)/\(viewModel.questions.count) câu thuộc làu")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.9))

                    Spacer()

                    Text("\(viewModel.progressPercent)% hoàn thành")
                        .font(.caption.weight(.bold))
                        .foregroundColor(.white)
                }
            }

            // Nút Bắt Đầu Học Ngay
            Button(action: {
                selectedTab = 1 // Chuyển sang Tab Học bài
            }) {
                HStack {
                    Text("Vào học câu hôm nay")
                        .font(.subheadline.weight(.bold))
                    Image(systemName: "arrow.right")
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Color.white)
                .foregroundColor(AppTheme.Colors.primary)
                .cornerRadius(AppTheme.CornerRadius.medium)
            }
            .buttonStyle(TactileButtonStyle())
        }
        .padding()
        .background(
            LinearGradient(
                colors: [AppTheme.Colors.primary, AppTheme.Colors.primaryDark],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(AppTheme.CornerRadius.extraLarge)
        .padding(.horizontal)
    }

    private var statsRow: some View {
        HStack(spacing: 12) {
            statCard(title: "Thuộc làu", count: "\(viewModel.masteredCount)", color: AppTheme.Colors.mastered, icon: "checkmark.seal.fill")
            statCard(title: "Mang máng", count: "\(viewModel.learningCount)", color: AppTheme.Colors.learning, icon: "clock.arrow.circlepath")
            statCard(title: "Cần ôn lại", count: "\(viewModel.forgotCount)", color: AppTheme.Colors.unlearned, icon: "exclamationmark.triangle.fill")
        }
        .padding(.horizontal)
    }

    private func statCard(title: String, count: String, color: Color, icon: String) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(color)

            Text(count)
                .font(.title3.weight(.bold))
                .foregroundColor(.primary)

            Text(title)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .appCardStyle(cornerRadius: AppTheme.CornerRadius.large)
    }

    private var quickQuestionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("10 CÂU LÝ THUYẾT VÕ ĐẠO")
                    .font(.caption.weight(.bold))
                    .foregroundColor(.secondary)

                Spacer()

                Button(action: {
                    selectedTab = 2 // Tab Ngân hàng câu hỏi
                }) {
                    Text("Xem tất cả")
                        .font(.caption.weight(.bold))
                        .foregroundColor(AppTheme.Colors.primary)
                }
            }

            VStack(spacing: 8) {
                ForEach(viewModel.questions) { q in
                    QuestionRowView(question: q) {
                        viewModel.selectQuestion(id: q.id)
                        selectedTab = 1 // Chuyển sang Tab Học bài
                    }
                }
            }
        }
        .padding()
        .background(AppTheme.Colors.secondaryCardBackground)
        .cornerRadius(AppTheme.CornerRadius.large)
        .padding(.horizontal)
    }

    private var resetProgressButton: some View {
        VStack(spacing: 12) {
            Button(action: {
                showingResetAlert = true
            }) {
                HStack {
                    Image(systemName: "arrow.counterclockwise.circle.fill")
                    Text("Đặt lại toàn bộ tiến độ học tập")
                }
                .font(.footnote.weight(.bold))
                .foregroundColor(AppTheme.Colors.unlearned)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(AppTheme.Colors.unlearnedBg)
                .cornerRadius(AppTheme.CornerRadius.medium)
            }
            .buttonStyle(TactileButtonStyle())
        }
        .padding(.horizontal)
        .padding(.bottom, 16)
    }
}
