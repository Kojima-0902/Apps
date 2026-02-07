import SwiftUI
import SwiftData
import Charts

struct WorkoutVolumeChartView: View {
    @Query(sort: \WorkoutSession.date) private var sessions: [WorkoutSession]

    @State private var selectedPeriod: VolumePeriod = .threeMonths

    enum VolumePeriod: String, CaseIterable, Identifiable {
        case oneMonth = "1ヶ月"
        case threeMonths = "3ヶ月"
        case sixMonths = "6ヶ月"
        case all = "全期間"

        var id: String { rawValue }

        var startDate: Date? {
            let calendar = Calendar.current
            switch self {
            case .oneMonth: return calendar.date(byAdding: .month, value: -1, to: Date())
            case .threeMonths: return calendar.date(byAdding: .month, value: -3, to: Date())
            case .sixMonths: return calendar.date(byAdding: .month, value: -6, to: Date())
            case .all: return nil
            }
        }
    }

    private var filteredSessions: [WorkoutSession] {
        guard let startDate = selectedPeriod.startDate else { return sessions }
        return sessions.filter { $0.date >= startDate }
    }

    struct VolumeByGroup: Identifiable {
        let id = UUID()
        let date: Date
        let muscleGroup: String
        let volume: Double
    }

    private var volumeData: [VolumeByGroup] {
        filteredSessions.flatMap { session in
            let grouped = Dictionary(grouping: session.exercises) { $0.muscleGroup }
            return grouped.map { group, exercises in
                VolumeByGroup(
                    date: session.date,
                    muscleGroup: group.rawValue,
                    volume: exercises.reduce(0) { $0 + $1.volume }
                )
            }
        }
    }

    private var weeklyAvgVolume: Double {
        guard filteredSessions.count >= 2,
              let first = filteredSessions.first?.date,
              let last = filteredSessions.last?.date else { return 0 }
        let weeks = max(Calendar.current.dateComponents([.weekOfYear], from: first, to: last).weekOfYear ?? 1, 1)
        let totalVolume = filteredSessions.reduce(0.0) { $0 + $1.totalVolume }
        return totalVolume / Double(weeks)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Picker("期間", selection: $selectedPeriod) {
                    ForEach(VolumePeriod.allCases) { period in
                        Text(period.rawValue).tag(period)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)

                if filteredSessions.isEmpty {
                    ContentUnavailableView {
                        Label("データなし", systemImage: "chart.bar")
                    } description: {
                        Text("トレーニングを記録するとグラフが表示されます")
                    }
                    .frame(height: 300)
                } else {
                    Chart(volumeData) { item in
                        BarMark(
                            x: .value("日付", item.date, unit: .day),
                            y: .value("ボリューム", item.volume)
                        )
                        .foregroundStyle(by: .value("部位", item.muscleGroup))
                    }
                    .chartForegroundStyleScale([
                        "胸": .red,
                        "背中": .blue,
                        "肩": .green,
                        "腕": .purple,
                        "脚": .orange,
                        "腹筋": .yellow,
                        "全身": .cyan,
                        "有酸素": .pink,
                        "その他": .gray,
                    ])
                    .chartLegend(position: .bottom, spacing: 10)
                    .chartXAxis {
                        AxisMarks(values: .stride(by: .day, count: filteredSessions.count > 20 ? 14 : 7)) { value in
                            AxisGridLine()
                            AxisValueLabel {
                                if let date = value.as(Date.self) {
                                    Text(date, format: .dateTime.month(.abbreviated).day())
                                        .font(.caption2)
                                }
                            }
                        }
                    }
                    .frame(height: 280)
                    .padding(.horizontal)

                    summaryCards
                }
            }
            .padding(.vertical)
        }
    }

    private var summaryCards: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                SummaryCard(
                    title: "トレーニング回数",
                    value: "\(filteredSessions.count)回",
                    icon: "figure.strengthtraining.traditional",
                    color: .orange
                )
                SummaryCard(
                    title: "週平均ボリューム",
                    value: "\(String(format: "%.0f", weeklyAvgVolume)) kg",
                    icon: "chart.line.uptrend.xyaxis",
                    color: .blue
                )
            }
        }
        .padding(.horizontal)
    }
}

struct SummaryCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(color)

            Text(value)
                .font(.title3)
                .fontWeight(.bold)

            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

#Preview {
    WorkoutVolumeChartView()
        .modelContainer(for: WorkoutSession.self, inMemory: true)
}
