import SwiftUI

public struct MistakeNotebookView: View {
    @ObservedObject public var viewModel: StudyViewModel
    @Binding public var selectedTab: Int

    public init(viewModel: StudyViewModel, selectedTab: Binding<Int>) {
        self.viewModel = viewModel
        self._selectedTab = selectedTab
    }

    public var body: some View {
        NavigationView {
            Group {
                if viewModel.mistakeQuestions.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 64))
                            .foregroundColor(AppTheme.Colors.mastered)

                        Text("Tuyệt vời! Không có câu nào bị quên")
                            .font(.headline)
                            .foregroundColor(.primary)

                        Text("Bạn đã học thuộc hoặc làm chủ toàn bộ các câu trong lộ trình. Hãy duy trì phản xạ bằng cách thi thử vấn đáp thường xuyên!")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                    .padding()
                } else {
                    List {
                        ForEach(viewModel.mistakeQuestions) { q in
                            QuestionRowView(
                                question: q,
                                showScoreBadge: true,
                                showCategory: false,
                                showMnemonic: true
                            ) {
                                viewModel.selectQuestion(id: q.id)
                                selectedTab = 1 // Chuyển sang Tab Học bài
                            }
                            .listRowSeparator(.hidden)
                            .listRowBackground(Color.clear)
                            .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 16))
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Sổ Tay Lỗi Sai")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
