import SwiftUI

public struct HomeView: View {
    @ObservedObject var viewModel: StudyViewModel
    @Binding var selectedTab: Int

    @State private var showingResetAlert = false

    public var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    // MARK: - Banner Tiến Độ Cấp Tốc 10 Ngày
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("LỘ TRÌNH CẤP TỐC")
                                    .font(.caption2)
                                    .fontWeight(.black)
                                    .foregroundColor(.white.opacity(0.8))
                                    .tracking(1)

                                Text("Ngày \(viewModel.currentDay) / 10 Ngày")
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                            }

                            Spacer()

                            // Streak
                            HStack(spacing: 4) {
                                Image(systemName: "flame.fill")
                                    .foregroundColor(.orange)
                                Text("\(viewModel.streakDays) ngày")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                            }
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.white.opacity(0.2))
                            .cornerRadius(12)
                        }

                        // Progress Bar
                        VStack(alignment: .leading, spacing: 4) {
                            ProgressView(value: Double(viewModel.masteredCount), total: Double(max(1, viewModel.questions.count)))
                                .tint(.yellow)

                            HStack {
                                Text("\(viewModel.masteredCount)/\(viewModel.questions.count) câu thuộc làu")
                                    .font(.caption)
                                    .foregroundColor(.white.opacity(0.9))

                                Spacer()

                                Text("\(viewModel.progressPercent)% hoàn thành")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                            }
                        }

                        // Nút Bắt Đầu Học Ngay
                        Button(action: {
                            selectedTab = 1 // Chuyển sang Tab Học bài
                        }) {
                            HStack {
                                Text("Vào học câu hôm nay")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                Image(systemName: "arrow.right")
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.white)
                            .foregroundColor(.blue)
                            .cornerRadius(12)
                        }
                    }
                    .padding()
                    .background(
                        LinearGradient(
                            colors: [Color.blue, Color(red: 0.1, green: 0.35, blue: 0.8)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .cornerRadius(20)
                    .shadow(color: Color.blue.opacity(0.25), radius: 8, x: 0, y: 4)
                    .padding(.horizontal)

                    // MARK: - Chỉ Số Đánh Giá
                    HStack(spacing: 12) {
                        statCard(title: "Thuộc làu", count: "\(viewModel.masteredCount)", color: .green, icon: "checkmark.seal.fill")
                        statCard(title: "Mang máng", count: "\(viewModel.learningCount)", color: .orange, icon: "clock.arrow.circlepath")
                        statCard(title: "Cần ôn lại", count: "\(viewModel.forgotCount)", color: .red, icon: "exclamationmark.triangle.fill")
                    }
                    .padding(.horizontal)

                    // MARK: - Danh Sách 10 Câu Hỏi Nhanh
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("10 CÂU LÝ THUYẾT VÕ ĐẠO")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(.secondary)

                            Spacer()

                            Button(action: {
                                selectedTab = 2 // Tab Ngân hàng câu hỏi
                            }) {
                                Text("Xem tất cả")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .foregroundColor(.blue)
                            }
                        }

                        VStack(spacing: 8) {
                            ForEach(viewModel.questions) { q in
                                Button(action: {
                                    viewModel.selectQuestion(id: q.id)
                                    selectedTab = 1 // Nhảy sang Tab Học bài
                                }) {
                                    HStack(spacing: 12) {
                                        Text("#\(q.number)")
                                            .font(.footnote)
                                            .fontWeight(.bold)
                                            .frame(width: 32, height: 32)
                                            .background(Color(.systemGray6))
                                            .cornerRadius(8)

                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(q.title)
                                                .font(.subheadline)
                                                .fontWeight(.semibold)
                                                .foregroundColor(.primary)
                                                .lineLimit(1)

                                            Text(q.category)
                                                .font(.caption2)
                                                .foregroundColor(.secondary)
                                        }

                                        Spacer()

                                        scoreBadge(q.score)

                                        Image(systemName: "chevron.right")
                                            .font(.caption2)
                                            .foregroundColor(.secondary)
                                    }
                                    .padding(.vertical, 8)
                                    .padding(.horizontal, 12)
                                    .background(Color(.systemBackground))
                                    .cornerRadius(12)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(18)
                    .padding(.horizontal)

                    // MARK: - Quản Lý & Nút Đặt Lại (100% HOẠT ĐỘNG)
                    VStack(spacing: 12) {
                        Button(action: {
                            showingResetAlert = true
                        }) {
                            HStack {
                                Image(systemName: "arrow.counterclockwise.circle.fill")
                                Text("Đặt lại toàn bộ tiến độ học tập")
                            }
                            .font(.footnote)
                            .fontWeight(.bold)
                            .foregroundColor(.red)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(12)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 16)
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

    private func statCard(title: String, count: String, color: Color, icon: String) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(color)

            Text(count)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(.primary)

            Text(title)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color(.systemBackground))
        .cornerRadius(14)
        .shadow(color: Color.black.opacity(0.04), radius: 5, x: 0, y: 2)
    }

    private func scoreBadge(_ score: Int) -> some View {
        Group {
            switch score {
            case 2:
                Text("Thuộc làu")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.green.opacity(0.15))
                    .foregroundColor(.green)
                    .cornerRadius(6)
            case 1:
                Text("Mang máng")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.orange.opacity(0.15))
                    .foregroundColor(.orange)
                    .cornerRadius(6)
            default:
                Text("Chưa thuộc")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.red.opacity(0.12))
                    .foregroundColor(.red)
                    .cornerRadius(6)
            }
        }
    }
}
