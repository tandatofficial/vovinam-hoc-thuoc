import SwiftUI

public struct QuestionsListView: View {
    @ObservedObject public var viewModel: StudyViewModel
    @Binding public var selectedTab: Int

    @State private var searchText: String = ""
    @State private var filterScore: Int? = nil // nil = tất cả, 2 = thuộc làu, 1 = mang máng, 0 = chưa thuộc

    public init(viewModel: StudyViewModel, selectedTab: Binding<Int>) {
        self.viewModel = viewModel
        self._selectedTab = selectedTab
    }

    private var filteredQuestions: [Question] {
        viewModel.questions.filter { q in
            let matchesSearch = searchText.isEmpty ||
                q.title.localizedCaseInsensitiveContains(searchText) ||
                q.easyAnswer.headlineQuote.localizedCaseInsensitiveContains(searchText) ||
                "\(q.number)".contains(searchText)

            let matchesFilter = (filterScore == nil) || (q.score == filterScore)
            return matchesSearch && matchesFilter
        }
    }

    public var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // MARK: - Bộ Lọc Nhanh Trạng Thái (Pills)
                filterBar

                // MARK: - Danh Sách Câu Hỏi
                List {
                    ForEach(filteredQuestions) { q in
                        QuestionRowView(
                            question: q,
                            showScoreBadge: true,
                            showCategory: true,
                            showMnemonic: false
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
            .navigationTitle("Ngân Hàng Câu Hỏi")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Tìm theo số câu, từ khóa, nội dung...")
        }
    }

    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                filterPill(label: "Tất cả (\(viewModel.questions.count))", isSelected: filterScore == nil) {
                    filterScore = nil
                }

                filterPill(label: "Thuộc làu (\(viewModel.masteredCount))", isSelected: filterScore == 2) {
                    filterScore = 2
                }

                filterPill(label: "Mang máng (\(viewModel.learningCount))", isSelected: filterScore == 1) {
                    filterScore = 1
                }

                filterPill(label: "Chưa thuộc (\(viewModel.forgotCount))", isSelected: filterScore == 0) {
                    filterScore = 0
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
        }
        .background(Color(.systemBackground))
        .overlay(
            Divider(), alignment: .bottom
        )
    }

    private func filterPill(label: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.caption.weight(isSelected ? .bold : .medium))
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? AppTheme.Colors.primary : Color(.systemGray6))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(AppTheme.CornerRadius.small)
        }
        .buttonStyle(TactileButtonStyle())
    }
}
