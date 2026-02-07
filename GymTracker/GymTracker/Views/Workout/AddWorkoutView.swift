import SwiftUI
import SwiftData

struct AddWorkoutView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var date = Date()
    @State private var durationMinutes = 60
    @State private var note = ""
    @State private var sets: [SetEntry] = []
    @State private var showingExercisePicker = false
    @State private var selectedMuscleGroup: MuscleGroup = .chest

    struct SetEntry: Identifiable {
        let id = UUID()
        var exerciseName: String
        var muscleGroup: MuscleGroup
        var setNumber: Int
        var weight: String
        var reps: String
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("基本情報") {
                    DatePicker("日付", selection: $date, displayedComponents: .date)
                        .environment(\.locale, Locale(identifier: "ja_JP"))

                    Stepper("トレーニング時間: \(durationMinutes)分", value: $durationMinutes, in: 0...300, step: 5)

                    TextField("メモ（任意）", text: $note, axis: .vertical)
                        .lineLimit(2...4)
                }

                Section {
                    Button {
                        showingExercisePicker = true
                    } label: {
                        Label("種目を追加", systemImage: "plus.circle.fill")
                            .foregroundStyle(.orange)
                    }
                } header: {
                    Text("種目・セット")
                } footer: {
                    if sets.isEmpty {
                        Text("種目を追加してトレーニング内容を記録しましょう")
                    }
                }

                ForEach(exerciseGroups, id: \.0) { exerciseName, exerciseSets in
                    Section(exerciseName) {
                        ForEach(exerciseSets.indices, id: \.self) { index in
                            if let setIndex = sets.firstIndex(where: { $0.id == exerciseSets[index].id }) {
                                SetRowEditor(set: $sets[setIndex])
                            }
                        }
                        .onDelete { offsets in
                            deleteSets(exerciseName: exerciseName, at: offsets)
                        }

                        Button {
                            addSet(for: exerciseName, exerciseSets: exerciseSets)
                        } label: {
                            Label("セット追加", systemImage: "plus")
                                .font(.caption)
                                .foregroundStyle(.orange)
                        }
                    }
                }
            }
            .navigationTitle("トレーニング記録")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("キャンセル") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("保存") { save() }
                        .fontWeight(.bold)
                        .disabled(sets.isEmpty)
                }
            }
            .sheet(isPresented: $showingExercisePicker) {
                ExercisePickerView(selectedMuscleGroup: $selectedMuscleGroup) { template in
                    let newSet = SetEntry(
                        exerciseName: template.name,
                        muscleGroup: template.muscleGroup,
                        setNumber: nextSetNumber(for: template.name),
                        weight: "",
                        reps: ""
                    )
                    sets.append(newSet)
                }
            }
        }
    }

    private var exerciseGroups: [(String, [SetEntry])] {
        var groups: [(String, [SetEntry])] = []
        var seen = Set<String>()
        for s in sets {
            if !seen.contains(s.exerciseName) {
                seen.insert(s.exerciseName)
                groups.append((s.exerciseName, sets.filter { $0.exerciseName == s.exerciseName }))
            }
        }
        return groups
    }

    private func nextSetNumber(for exerciseName: String) -> Int {
        let existing = sets.filter { $0.exerciseName == exerciseName }
        return existing.count + 1
    }

    private func addSet(for exerciseName: String, exerciseSets: [SetEntry]) {
        guard let last = exerciseSets.last else { return }
        let newSet = SetEntry(
            exerciseName: exerciseName,
            muscleGroup: last.muscleGroup,
            setNumber: exerciseSets.count + 1,
            weight: last.weight,
            reps: last.reps
        )
        if let lastIndex = sets.lastIndex(where: { $0.exerciseName == exerciseName }) {
            sets.insert(newSet, at: lastIndex + 1)
        } else {
            sets.append(newSet)
        }
    }

    private func deleteSets(exerciseName: String, at offsets: IndexSet) {
        let exerciseSets = sets.filter { $0.exerciseName == exerciseName }
        let idsToRemove = offsets.map { exerciseSets[$0].id }
        sets.removeAll { idsToRemove.contains($0.id) }
    }

    private func save() {
        let session = WorkoutSession(date: date, note: note, durationMinutes: durationMinutes)
        modelContext.insert(session)

        for entry in sets {
            let exerciseSet = ExerciseSet(
                exerciseName: entry.exerciseName,
                muscleGroup: entry.muscleGroup,
                setNumber: entry.setNumber,
                weight: Double(entry.weight) ?? 0,
                reps: Int(entry.reps) ?? 0
            )
            exerciseSet.session = session
            modelContext.insert(exerciseSet)
        }

        dismiss()
    }
}

struct SetRowEditor: View {
    @Binding var set: AddWorkoutView.SetEntry

    var body: some View {
        HStack {
            Text("Set \(set.setNumber)")
                .font(.caption)
                .foregroundStyle(.secondary)
                .frame(width: 40)

            HStack(spacing: 4) {
                TextField("0", text: $set.weight)
                    .keyboardType(.decimalPad)
                    .frame(width: 60)
                    .textFieldStyle(.roundedBorder)
                Text("kg")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            HStack(spacing: 4) {
                TextField("0", text: $set.reps)
                    .keyboardType(.numberPad)
                    .frame(width: 50)
                    .textFieldStyle(.roundedBorder)
                Text("回")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

struct ExercisePickerView: View {
    @Environment(\.dismiss) private var dismiss
    @Binding var selectedMuscleGroup: MuscleGroup

    let onSelect: (ExerciseTemplate) -> Void

    @State private var searchText = ""
    @State private var customName = ""
    @State private var showingCustom = false

    private var filteredExercises: [ExerciseTemplate] {
        let grouped = ExerciseTemplate.defaults.filter { $0.muscleGroup == selectedMuscleGroup }
        if searchText.isEmpty { return grouped }
        return grouped.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(MuscleGroup.allCases) { group in
                            Button {
                                selectedMuscleGroup = group
                            } label: {
                                Text(group.rawValue)
                                    .font(.subheadline)
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(selectedMuscleGroup == group ? Color.orange : Color(.systemGray5))
                                    .foregroundStyle(selectedMuscleGroup == group ? .white : .primary)
                                    .clipShape(Capsule())
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                }

                List {
                    ForEach(filteredExercises) { exercise in
                        Button {
                            onSelect(exercise)
                            dismiss()
                        } label: {
                            HStack {
                                Image(systemName: exercise.muscleGroup.icon)
                                    .foregroundStyle(.orange)
                                    .frame(width: 30)
                                Text(exercise.name)
                                    .foregroundStyle(.primary)
                            }
                        }
                    }

                    Section {
                        if showingCustom {
                            HStack {
                                TextField("種目名を入力", text: $customName)
                                Button("追加") {
                                    guard !customName.isEmpty else { return }
                                    let template = ExerciseTemplate(
                                        name: customName,
                                        muscleGroup: selectedMuscleGroup
                                    )
                                    onSelect(template)
                                    dismiss()
                                }
                                .buttonStyle(.borderedProminent)
                                .tint(.orange)
                            }
                        } else {
                            Button {
                                showingCustom = true
                            } label: {
                                Label("カスタム種目を追加", systemImage: "plus.circle")
                                    .foregroundStyle(.orange)
                            }
                        }
                    }
                }
            }
            .navigationTitle("種目を選択")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "種目を検索")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("閉じる") { dismiss() }
                }
            }
        }
    }
}

#Preview {
    AddWorkoutView()
        .modelContainer(for: WorkoutSession.self, inMemory: true)
}
