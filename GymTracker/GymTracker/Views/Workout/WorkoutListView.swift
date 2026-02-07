import SwiftUI
import SwiftData

struct WorkoutListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \WorkoutSession.date, order: .reverse) private var sessions: [WorkoutSession]
    @State private var showingAddWorkout = false

    private var groupedSessions: [(String, [WorkoutSession])] {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy年M月"
        let grouped = Dictionary(grouping: sessions) { formatter.string(from: $0.date) }
        return grouped.sorted { $0.key > $1.key }
    }

    var body: some View {
        NavigationStack {
            Group {
                if sessions.isEmpty {
                    emptyState
                } else {
                    sessionList
                }
            }
            .navigationTitle("トレーニング")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showingAddWorkout = true
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title3)
                    }
                }
            }
            .sheet(isPresented: $showingAddWorkout) {
                AddWorkoutView()
            }
        }
    }

    private var emptyState: some View {
        ContentUnavailableView {
            Label("トレーニング記録なし", systemImage: "dumbbell")
        } description: {
            Text("右上の＋ボタンからトレーニングを記録しましょう")
        } actions: {
            Button("記録を追加") {
                showingAddWorkout = true
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
        }
    }

    private var sessionList: some View {
        List {
            ForEach(groupedSessions, id: \.0) { month, monthSessions in
                Section(month) {
                    ForEach(monthSessions) { session in
                        NavigationLink(destination: WorkoutDetailView(session: session)) {
                            WorkoutRowView(session: session)
                        }
                    }
                    .onDelete { offsets in
                        deleteSession(from: monthSessions, at: offsets)
                    }
                }
            }
        }
    }

    private func deleteSession(from monthSessions: [WorkoutSession], at offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(monthSessions[index])
        }
    }
}

struct WorkoutRowView: View {
    let session: WorkoutSession

    private var dateFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "M/d (E)"
        f.locale = Locale(identifier: "ja_JP")
        return f
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(dateFormatter.string(from: session.date))
                    .font(.headline)

                Spacer()

                if session.durationMinutes > 0 {
                    Label("\(session.durationMinutes)分", systemImage: "clock")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            HStack(spacing: 4) {
                ForEach(session.muscleGroups) { group in
                    Text(group.rawValue)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(Color.orange.opacity(0.15))
                        .foregroundStyle(.orange)
                        .clipShape(Capsule())
                }
            }

            HStack {
                Text("\(session.exercises.count)セット")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                Text("·")
                    .foregroundStyle(.secondary)

                Text("合計 \(String(format: "%.0f", session.totalVolume)) kg")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    WorkoutListView()
        .modelContainer(for: WorkoutSession.self, inMemory: true)
}
