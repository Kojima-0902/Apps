import SwiftUI
import SwiftData
import Charts

struct ExerciseProgressChartView: View {
    @Query(sort: \WorkoutSession.date) private var sessions: [WorkoutSession]

    @State private var selectedExercise: String = ""

    private var allExerciseNames: [String] {
        var names = Set<String>()
        for session in sessions {
            for exercise in session.exercises {
                names.insert(exercise.exerciseName)
            }
        }
        return Array(names).sorted()
    }

    struct ProgressPoint: Identifiable {
        let id = UUID()
        let date: Date
        let maxWeight: Double
        let totalVolume: Double
        let maxReps: Int
    }

    private var progressData: [ProgressPoint] {
        sessions.compactMap { session in
            let exerciseSets = session.exercises.filter { $0.exerciseName == selectedExercise }
            guard !exerciseSets.isEmpty else { return nil }
            return ProgressPoint(
                date: session.date,
                maxWeight: exerciseSets.map { $0.weight }.max() ?? 0,
                totalVolume: exerciseSets.reduce(0) { $0 + $1.volume },
                maxReps: exerciseSets.map { $0.reps }.max() ?? 0
            )
        }
    }

    @State private var chartMode: ChartMode = .maxWeight

    enum ChartMode: String, CaseIterable, Identifiable {
        case maxWeight = "最大重量"
        case volume = "ボリューム"

        var id: String { rawValue }
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if allExerciseNames.isEmpty {
                    ContentUnavailableView {
                        Label("データなし", systemImage: "chart.xyaxis.line")
                    } description: {
                        Text("トレーニングを記録すると種目別の推移が表示されます")
                    }
                    .frame(height: 300)
                } else {
                    exerciseSelector

                    if !selectedExercise.isEmpty {
                        Picker("表示", selection: $chartMode) {
                            ForEach(ChartMode.allCases) { mode in
                                Text(mode.rawValue).tag(mode)
                            }
                        }
                        .pickerStyle(.segmented)
                        .padding(.horizontal)

                        if progressData.isEmpty {
                            Text("選択した種目のデータがありません")
                                .foregroundStyle(.secondary)
                                .frame(height: 250)
                        } else {
                            progressChart
                            recordCards
                        }
                    }
                }
            }
            .padding(.vertical)
        }
        .onAppear {
            if selectedExercise.isEmpty, let first = allExerciseNames.first {
                selectedExercise = first
            }
        }
    }

    private var exerciseSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(allExerciseNames, id: \.self) { name in
                    Button {
                        selectedExercise = name
                    } label: {
                        Text(name)
                            .font(.subheadline)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(selectedExercise == name ? Color.orange : Color(.systemGray5))
                            .foregroundStyle(selectedExercise == name ? .white : .primary)
                            .clipShape(Capsule())
                    }
                }
            }
            .padding(.horizontal)
        }
    }

    private var progressChart: some View {
        Chart(progressData) { point in
            switch chartMode {
            case .maxWeight:
                LineMark(
                    x: .value("日付", point.date),
                    y: .value("重量", point.maxWeight)
                )
                .foregroundStyle(.orange)
                .symbol(Circle())

                PointMark(
                    x: .value("日付", point.date),
                    y: .value("重量", point.maxWeight)
                )
                .foregroundStyle(.orange)
                .symbolSize(40)

            case .volume:
                BarMark(
                    x: .value("日付", point.date, unit: .day),
                    y: .value("ボリューム", point.totalVolume)
                )
                .foregroundStyle(.orange.gradient)
            }
        }
        .chartYAxis {
            AxisMarks(position: .leading) { value in
                AxisGridLine()
                AxisValueLabel {
                    if let val = value.as(Double.self) {
                        Text("\(String(format: "%.0f", val))")
                            .font(.caption2)
                    }
                }
            }
        }
        .frame(height: 250)
        .padding(.horizontal)
    }

    private var recordCards: some View {
        VStack(spacing: 8) {
            if let bestWeight = progressData.map({ $0.maxWeight }).max() {
                HStack {
                    Image(systemName: "trophy.fill")
                        .foregroundStyle(.yellow)
                    Text("自己ベスト重量")
                        .font(.subheadline)
                    Spacer()
                    Text("\(String(format: "%.1f", bestWeight)) kg")
                        .font(.headline)
                        .foregroundStyle(.orange)
                }
                .padding()
                .background(Color(.systemGray6))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }

            if let bestVolume = progressData.map({ $0.totalVolume }).max() {
                HStack {
                    Image(systemName: "flame.fill")
                        .foregroundStyle(.red)
                    Text("最大ボリューム")
                        .font(.subheadline)
                    Spacer()
                    Text("\(String(format: "%.0f", bestVolume)) kg")
                        .font(.headline)
                        .foregroundStyle(.orange)
                }
                .padding()
                .background(Color(.systemGray6))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }

            if progressData.count >= 2 {
                let first = progressData.first!.maxWeight
                let last = progressData.last!.maxWeight
                let change = last - first
                HStack {
                    Image(systemName: change >= 0 ? "arrow.up.right.circle.fill" : "arrow.down.right.circle.fill")
                        .foregroundStyle(change >= 0 ? .green : .red)
                    Text("期間内の成長")
                        .font(.subheadline)
                    Spacer()
                    Text("\(String(format: "%+.1f", change)) kg")
                        .font(.headline)
                        .foregroundStyle(change >= 0 ? .green : .red)
                }
                .padding()
                .background(Color(.systemGray6))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
        .padding(.horizontal)
    }
}

#Preview {
    ExerciseProgressChartView()
        .modelContainer(for: WorkoutSession.self, inMemory: true)
}
