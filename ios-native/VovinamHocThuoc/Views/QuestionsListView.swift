import SwiftUI

public struct QuestionsListView: View {
    @ObservedObject var viewModel: StudyViewModel
    @Binding var selectedTab: Int

    @State private var searchText: String = ""
    @State private var filterScore: Int? = nil // nil = tất cả, 0, 1, 2

    private var filteredQuestions: [Question] {
        viewModel.questions.filter { q in
            let matchesSearch = searchText.isEmpty ||
                q.title.localizedCaseInsensitiveContains(searchText) ||
                q.keywords.localizedCaseInsensitiveContains(searchText) ||
                q.easyAnswer.coreMeaning.localizedCaseInsensitiveContains(searchText)

            let matchesFilter = filterScore == nil || q.score == filterScore
            return matchesSearch && matchesFilter
        }
    }

    public var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // MARK: - Search & Filters
                VStack(spacing: 8) {
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.secondary)
                        TextField("Tìm kiếm theo tên câu, từ khóa...", text: $searchText)
                            .font(.subheadline)
                        if !searchText.isEmpty {
                            Button(action: { searchText = "" }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .padding(10)
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                    .padding(.horizontal)

                    // Filter Pills
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
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
                    }
                }
                .padding(.vertical, 8)
                .background(Color(.systemBackground))

                // MARK: - Questions List
                List {
                    ForEach(filteredQuestions) { q in
                        Button(action: {
                            viewModel.selectQuestion(id: q.id)
                            selectedTab = 1 // Chuyển sang Tab Học bài
                        }) {
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text("CÂU #\(q.number)")
                                        .font(.caption2.weight(.bold))
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(Color.blue.opacity(0.12))
                                        .foregroundColor(.blue)
                                        .cornerRadius(6)

                                    Spacer()

                                    scoreBadge(q.score)
                                }

                                Text(q.title)
                                    .font(.headline.weight(.bold))
                                    .foregroundColor(.primary)

                                Text(q.easyAnswer.headlineQuote)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                    .lineLimit(2)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }
                .listStyle(.insetGrouped)
            }
            .navigationTitle("Ngân Hàng Câu Hỏi")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private func filterPill(label: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.caption.weight(isSelected ? .bold : .medium))
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(isSelected ? Color.blue : Color(.systemGray6))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(10)
        }
    }

    private func scoreBadge(_ score: Int) -> some View {
        Group {
            switch score {
            case 2:
                Text("Thuộc làu")
                    .font(.caption2.weight(.bold))
                    .padding(.horizontal, 7)
                    .padding(.vertical, 2)
                    .background(Color.green.opacity(0.15))
                    .foregroundColor(.green)
                    .cornerRadius(6)
            case 1:
                Text("Mang máng")
                    .font(.caption2.weight(.bold))
                    .padding(.horizontal, 7)
                    .padding(.vertical, 2)
                    .background(Color.orange.opacity(0.15))
                    .foregroundColor(.orange)
                    .cornerRadius(6)
            default:
                Text("Chưa thuộc")
                    .font(.caption2.weight(.bold))
                    .padding(.horizontal, 7)
                    .padding(.vertical, 2)
                    .background(Color.red.opacity(0.12))
                    .foregroundColor(.red)
                    .cornerRadius(6)
            }
        }
    }
}
