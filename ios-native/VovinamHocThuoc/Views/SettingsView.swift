import SwiftUI

public struct SettingsView: View {
    @ObservedObject var viewModel: StudyViewModel

    @State private var showingResetAlert = false
    @State private var showingImportSheet = false
    @State private var importJsonText: String = ""

    public var body: some View {
        NavigationView {
            List {
                // Section 1: Tiến độ học tập & Đặt lại
                Section(header: Text("Tiến Độ Học Tập")) {
                    HStack {
                        Text("Ngày học hiện tại")
                        Spacer()
                        Picker("", selection: Binding(
                            get: { viewModel.currentDay },
                            set: { viewModel.setCurrentDay($0) }
                        )) {
                            ForEach(1...10, id: \.self) { day in
                                Text("Ngày \(day)").tag(day)
                            }
                        }
                        .pickerStyle(.menu)
                    }

                    Button(action: {
                        showingResetAlert = true
                    }) {
                        HStack {
                            Image(systemName: "arrow.counterclockwise.circle.fill")
                                .foregroundColor(.red)
                            Text("Đặt lại toàn bộ tiến độ")
                                .foregroundColor(.red)
                                .fontWeight(.semibold)
                        }
                    }
                }

                // Section 2: Quản lý dữ liệu (Không bị hardcode)
                Section(header: Text("Dữ Liệu Câu Hỏi (Tùy Biến Động)"), footer: Text("Dữ liệu được lưu trữ trực tiếp dưới dạng tệp JSON trong bộ nhớ máy của bạn, không bị gán cứng (hardcode) và có thể nhập/xuất tùy ý.")) {
                    Button(action: {
                        UIPasteboard.general.string = viewModel.exportQuestions()
                        viewModel.showToast("Đã sao chép JSON câu hỏi vào bộ nhớ tạm!")
                    }) {
                        HStack {
                            Image(systemName: "doc.on.doc.fill")
                                .foregroundColor(.blue)
                            Text("Sao chép dữ liệu JSON (Xuất)")
                                .foregroundColor(.primary)
                        }
                    }

                    Button(action: {
                        importJsonText = viewModel.exportQuestions()
                        showingImportSheet = true
                    }) {
                        HStack {
                            Image(systemName: "square.and.arrow.down.fill")
                                .foregroundColor(.orange)
                            Text("Chỉnh sửa hoặc nạp JSON mới (Nhập)")
                                .foregroundColor(.primary)
                        }
                    }
                }

                // Section 3: Thông tin ứng dụng
                Section(header: Text("Thông Tin")) {
                    HStack {
                        Text("Nền tảng")
                        Spacer()
                        Text("Native Swift (iOS 15 SwiftUI)")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("Âm thanh")
                        Spacer()
                        Text("AVSpeechSynthesizer (vi-VN)")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("Cài đặt")
                        Spacer()
                        Text("TrollStore / Không hết hạn")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Cài Đặt")
            .navigationBarTitleDisplayMode(.inline)
            .alert(isPresented: $showingResetAlert) {
                Alert(
                    title: Text("Xác nhận đặt lại tiến độ"),
                    message: Text("Hành động này sẽ xóa sạch điểm đánh giá của tất cả 10 câu và đặt lại ngày học về Ngày 1. Bạn chắc chắn muốn thực hiện?"),
                    primaryButton: .destructive(Text("Đặt lại")) {
                        viewModel.resetAllProgress()
                    },
                    secondaryButton: .cancel(Text("Hủy"))
                )
            }
            .sheet(isPresented: $showingImportSheet) {
                NavigationView {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Dán mã JSON câu hỏi cần cập nhật:")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .padding(.horizontal)

                        TextEditor(text: $importJsonText)
                            .font(.system(.caption, design: .monospaced))
                            .padding(8)
                            .background(Color(.systemGray6))
                            .cornerRadius(12)
                            .padding(.horizontal)

                        Button(action: {
                            if viewModel.importQuestions(from: importJsonText) {
                                showingImportSheet = false
                            }
                        }) {
                            Text("Lưu & Cập nhật câu hỏi")
                                .font(.headline)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(12)
                        }
                        .padding()
                    }
                    .padding(.top, 8)
                    .navigationTitle("Nạp Dữ Liệu JSON")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .navigationBarLeading) {
                            Button("Đóng") { showingImportSheet = false }
                        }
                    }
                }
            }
        }
    }
}
