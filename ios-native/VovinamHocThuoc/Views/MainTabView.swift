import SwiftUI

public struct MainTabView: View {
    @StateObject private var viewModel = StudyViewModel.shared
    @State private var selectedTab: Int = 0

    public var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                HomeView(viewModel: viewModel, selectedTab: $selectedTab)
                    .tabItem {
                        Label("Trang chủ", systemImage: "house.fill")
                    }
                    .tag(0)

                StudyView(viewModel: viewModel)
                    .tabItem {
                        Label("Học bài", systemImage: "book.fill")
                    }
                    .tag(1)

                QuestionsListView(viewModel: viewModel, selectedTab: $selectedTab)
                    .tabItem {
                        Label("Ngân hàng", systemImage: "list.bullet.rectangle.portrait.fill")
                    }
                    .tag(2)

                ExamView(viewModel: viewModel)
                    .tabItem {
                        Label("Thi thử", systemImage: "graduationcap.fill")
                    }
                    .tag(3)

                SettingsView(viewModel: viewModel)
                    .tabItem {
                        Label("Cài đặt", systemImage: "gearshape.fill")
                    }
                    .tag(4)
            }

            // Toast feedback
            if let toast = viewModel.toastMessage {
                VStack {
                    Spacer()
                    Text(toast)
                        .font(.footnote)
                        .fontWeight(.bold)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(Color(.systemGray6))
                        .foregroundColor(.primary)
                        .cornerRadius(20)
                        .shadow(color: Color.black.opacity(0.15), radius: 8, x: 0, y: 4)
                        .padding(.bottom, 60)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
                .animation(.spring(), value: viewModel.toastMessage)
            }
        }
    }
}
