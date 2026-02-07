import SwiftUI
import SwiftData

struct AddBodyWeightView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query(sort: \BodyWeightEntry.date, order: .reverse) private var entries: [BodyWeightEntry]

    @State private var date = Date()
    @State private var weightText = ""
    @State private var note = ""

    @FocusState private var weightFieldFocused: Bool

    var body: some View {
        NavigationStack {
            Form {
                Section("日付") {
                    DatePicker("日付", selection: $date, displayedComponents: .date)
                        .environment(\.locale, Locale(identifier: "ja_JP"))
                }

                Section("体重") {
                    HStack {
                        TextField("0.0", text: $weightText)
                            .keyboardType(.decimalPad)
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .focused($weightFieldFocused)

                        Text("kg")
                            .font(.title2)
                            .foregroundStyle(.secondary)
                    }

                    if let lastWeight = entries.first?.weight {
                        HStack {
                            Text("前回の記録:")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            Text("\(String(format: "%.1f", lastWeight)) kg")
                                .font(.caption)
                                .foregroundStyle(.orange)
                        }
                    }
                }

                Section("メモ（任意）") {
                    TextField("体調や食事メモなど", text: $note, axis: .vertical)
                        .lineLimit(2...4)
                }
            }
            .navigationTitle("体重を記録")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("キャンセル") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("保存") { save() }
                        .fontWeight(.bold)
                        .disabled(Double(weightText) == nil)
                }
            }
            .onAppear {
                if let lastWeight = entries.first?.weight {
                    weightText = String(format: "%.1f", lastWeight)
                }
                weightFieldFocused = true
            }
        }
    }

    private func save() {
        guard let weight = Double(weightText) else { return }
        let entry = BodyWeightEntry(date: date, weight: weight, note: note)
        modelContext.insert(entry)
        dismiss()
    }
}

#Preview {
    AddBodyWeightView()
        .modelContainer(for: BodyWeightEntry.self, inMemory: true)
}
