import SwiftUI

struct WorkoutDetailView: View {
    let session: WorkoutSession

    private var dateFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "yyyy年M月d日 (E)"
        f.locale = Locale(identifier: "ja_JP")
        return f
    }

    private var exerciseGroups: [(String, [ExerciseSet])] {
        var groups: [(String, [ExerciseSet])] = []
        var seen = Set<String>()
        for exercise in session.exercises.sorted(by: { $0.timestamp < $1.timestamp }) {
            if !seen.contains(exercise.exerciseName) {
                seen.insert(exercise.exerciseName)
                let exerciseSets = session.exercises
                    .filter { $0.exerciseName == exercise.exerciseName }
                    .sorted { $0.setNumber < $1.setNumber }
                groups.append((exercise.exerciseName, exerciseSets))
            }
        }
        return groups
    }

    var body: some View {
        List {
            Section {
                HStack {
                    Label("日付", systemImage: "calendar")
                        .foregroundStyle(.secondary)
                    Spacer()
                    Text(dateFormatter.string(from: session.date))
                }

                if session.durationMinutes > 0 {
                    HStack {
                        Label("時間", systemImage: "clock")
                            .foregroundStyle(.secondary)
                        Spacer()
                        Text("\(session.durationMinutes)分")
                    }
                }

                HStack {
                    Label("合計ボリューム", systemImage: "flame.fill")
                        .foregroundStyle(.secondary)
                    Spacer()
                    Text("\(String(format: "%.0f", session.totalVolume)) kg")
                        .fontWeight(.semibold)
                        .foregroundStyle(.orange)
                }

                if !session.note.isEmpty {
                    HStack(alignment: .top) {
                        Label("メモ", systemImage: "note.text")
                            .foregroundStyle(.secondary)
                        Spacer()
                        Text(session.note)
                            .multilineTextAlignment(.trailing)
                    }
                }
            }

            ForEach(exerciseGroups, id: \.0) { exerciseName, sets in
                Section(exerciseName) {
                    ForEach(sets, id: \.id) { exerciseSet in
                        HStack {
                            Text("Set \(exerciseSet.setNumber)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .frame(width: 44, alignment: .leading)

                            Spacer()

                            Text("\(String(format: "%.1f", exerciseSet.weight)) kg")
                                .frame(width: 80, alignment: .trailing)

                            Text("×")
                                .foregroundStyle(.secondary)
                                .padding(.horizontal, 4)

                            Text("\(exerciseSet.reps) 回")
                                .frame(width: 50, alignment: .trailing)

                            Text("\(String(format: "%.0f", exerciseSet.volume)) kg")
                                .font(.caption)
                                .foregroundStyle(.orange)
                                .frame(width: 60, alignment: .trailing)
                        }
                    }

                    let totalVol = sets.reduce(0.0) { $0 + $1.volume }
                    HStack {
                        Text("小計")
                            .font(.caption)
                            .fontWeight(.semibold)
                        Spacer()
                        Text("\(String(format: "%.0f", totalVol)) kg")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundStyle(.orange)
                    }
                }
            }
        }
        .navigationTitle("トレーニング詳細")
        .navigationBarTitleDisplayMode(.inline)
    }
}
