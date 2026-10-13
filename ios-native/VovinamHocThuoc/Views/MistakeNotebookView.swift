import SwiftUI

public struct MistakeNotebookView: View {
    @ObservedObject var viewModel: StudyViewModel
    @Binding var selectedTab: Int

    public var body: some View {
        NavigationView {
            VStack {
                if viewModel.mistakeQuestions.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 64))
                            .foregroundColor(.green)

                        Text("Không có câu nào bị quên!")
                            .font(.headline)

                        Text("Tuyệt vời! Bạn chưa có câu nào đánh giá 0 điểm hoặc đánh dấu sao cần chú ý.")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                    .padding()
                } else {
                    List {
                        ForEach(viewModel.mistakeQuestions) { q in
                            Button(action: {
                                viewModel.selectQuestion(id: q.id)
                                selectedTab = 1 // Chuyển sang Tab Học bài
                            }) {
                                VStack(alignment: .leading, spacing: 8) {
                                    HStack {
                                        Text("CÂU #\(q.number)")
                                            .font(.caption2)
                                            .fontWeight(.bold)
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 2)
                                            .background(Color.red.opacity(0.12))
                                            .foregroundColor(.red)
                                            .cornerRadius(6)

                                        Spacer()

                                        if q.isMarkedFavorite {
                                            Image(systemName: "star.fill")
                                                .foregroundColor(.yellow)
                                                .font(.caption)
                                        }

                                        Text(q.score == 0 ? "Quên (0đ)" : "Đã ghim")
                                            .font(.caption2)
                                            .fontWeight(.bold)
                                            .foregroundColor(.red)
                                    }

                                    Text(q.title)
                                        .font(.headline)
                                        .fontWeight(.bold)
                                        .foregroundColor(.primary)

                                    Text(q.easyAnswer.mnemonic)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                .padding(.vertical, 4)
                            }
                        }
                    }
                    .listStyle(.insetGrouped)
                }
            }
            .navigationTitle("Sổ Tay Lỗi Sai")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
