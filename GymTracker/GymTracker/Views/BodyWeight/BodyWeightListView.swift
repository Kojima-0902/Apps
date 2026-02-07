import SwiftUI
import SwiftData

struct BodyWeightListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \BodyWeightEntry.date, order: .reverse) private var entries: [BodyWeightEntry]
    @State private var showingAddEntry = false

    private var latestWeight: Double? {
        entries.first?.weight
    }

    private var weightChange: Double? {
        guard entries.count >= 2 else { return nil }
        return entries[0].weight - entries[1].weight
    }

    var body: some View {
        NavigationStack {
            Group {
                if entries.isEmpty {
                    emptyState
                } else {
                    entryList
                }
            }
            .navigationTitle("体重記録")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showingAddEntry = true
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title3)
                    }
                }
            }
            .sheet(isPresented: $showingAddEntry) {
                AddBodyWeightView()
            }
        }
    }

    private var emptyState: some View {
        ContentUnavailableView {
            Label("体重記録なし", systemImage: "scalemass")
        } description: {
            Text("右上の＋ボタンから体重を記録しましょう")
        } actions: {
            Button("記録を追加") {
                showingAddEntry = true
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
        }
    }

    private var entryList: some View {
        List {
            if let weight = latestWeight {
                Section {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("現在の体重")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            Text("\(String(format: "%.1f", weight)) kg")
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundStyle(.orange)
                        }

                        Spacer()

                        if let change = weightChange {
                            VStack(alignment: .trailing, spacing: 4) {
                                Text("前回比")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                HStack(spacing: 2) {
                                    Image(systemName: change >= 0 ? "arrow.up.right" : "arrow.down.right")
                                    Text("\(String(format: "%+.1f", change)) kg")
                                }
                                .font(.title3)
                                .fontWeight(.semibold)
                                .foregroundStyle(change >= 0 ? .red : .blue)
                            }
                        }
                    }
                    .padding(.vertical, 8)
                }
            }

            Section("履歴") {
                ForEach(entries) { entry in
                    BodyWeightRowView(entry: entry)
                }
                .onDelete(perform: deleteEntries)
            }
        }
    }

    private func deleteEntries(at offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(entries[index])
        }
    }
}

struct BodyWeightRowView: View {
    let entry: BodyWeightEntry

    private var dateFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "M/d (E)"
        f.locale = Locale(identifier: "ja_JP")
        return f
    }

    var body: some View {
        HStack {
            Text(dateFormatter.string(from: entry.date))
                .foregroundStyle(.secondary)

            Spacer()

            Text("\(String(format: "%.1f", entry.weight)) kg")
                .fontWeight(.medium)

            if !entry.note.isEmpty {
                Image(systemName: "note.text")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

#Preview {
    BodyWeightListView()
        .modelContainer(for: BodyWeightEntry.self, inMemory: true)
}
