import SwiftUI
import SwiftData
import Charts

struct BodyWeightChartView: View {
    @Query(sort: \BodyWeightEntry.date) private var entries: [BodyWeightEntry]

    @State private var selectedPeriod: TimePeriod = .threeMonths

    enum TimePeriod: String, CaseIterable, Identifiable {
        case oneMonth = "1ヶ月"
        case threeMonths = "3ヶ月"
        case sixMonths = "6ヶ月"
        case oneYear = "1年"
        case all = "全期間"

        var id: String { rawValue }

        var startDate: Date? {
            let calendar = Calendar.current
            switch self {
            case .oneMonth: return calendar.date(byAdding: .month, value: -1, to: Date())
            case .threeMonths: return calendar.date(byAdding: .month, value: -3, to: Date())
            case .sixMonths: return calendar.date(byAdding: .month, value: -6, to: Date())
            case .oneYear: return calendar.date(byAdding: .year, value: -1, to: Date())
            case .all: return nil
            }
        }
    }

    private var filteredEntries: [BodyWeightEntry] {
        guard let startDate = selectedPeriod.startDate else { return entries }
        return entries.filter { $0.date >= startDate }
    }

    private var yAxisRange: ClosedRange<Double> {
        guard let minWeight = filteredEntries.map({ $0.weight }).min(),
              let maxWeight = filteredEntries.map({ $0.weight }).max() else {
            return 40...100
        }
        let padding = max((maxWeight - minWeight) * 0.15, 1.0)
        return (minWeight - padding)...(maxWeight + padding)
    }

    private var stats: (min: Double, max: Double, avg: Double, change: Double)? {
        guard !filteredEntries.isEmpty else { return nil }
        let weights = filteredEntries.map { $0.weight }
        let min = weights.min() ?? 0
        let max = weights.max() ?? 0
        let avg = weights.reduce(0, +) / Double(weights.count)
        let change = (filteredEntries.last?.weight ?? 0) - (filteredEntries.first?.weight ?? 0)
        return (min, max, avg, change)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Picker("期間", selection: $selectedPeriod) {
                    ForEach(TimePeriod.allCases) { period in
                        Text(period.rawValue).tag(period)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)

                if filteredEntries.isEmpty {
                    ContentUnavailableView {
                        Label("データなし", systemImage: "chart.line.downtrend.xyaxis")
                    } description: {
                        Text("体重を記録するとグラフが表示されます")
                    }
                    .frame(height: 300)
                } else {
                    Chart(filteredEntries) { entry in
                        LineMark(
                            x: .value("日付", entry.date),
                            y: .value("体重", entry.weight)
                        )
                        .foregroundStyle(.orange)
                        .interpolationMethod(.catmullRom)

                        AreaMark(
                            x: .value("日付", entry.date),
                            y: .value("体重", entry.weight)
                        )
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.orange.opacity(0.3), .orange.opacity(0.05)],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .interpolationMethod(.catmullRom)

                        PointMark(
                            x: .value("日付", entry.date),
                            y: .value("体重", entry.weight)
                        )
                        .foregroundStyle(.orange)
                        .symbolSize(30)
                    }
                    .chartYScale(domain: yAxisRange)
                    .chartYAxis {
                        AxisMarks(position: .leading) { value in
                            AxisGridLine()
                            AxisValueLabel {
                                if let weight = value.as(Double.self) {
                                    Text("\(String(format: "%.1f", weight))")
                                        .font(.caption2)
                                }
                            }
                        }
                    }
                    .chartXAxis {
                        AxisMarks(values: .stride(by: .day, count: filteredEntries.count > 30 ? 14 : 7)) { value in
                            AxisGridLine()
                            AxisValueLabel {
                                if let date = value.as(Date.self) {
                                    Text(date, format: .dateTime.month(.abbreviated).day())
                                        .font(.caption2)
                                }
                            }
                        }
                    }
                    .frame(height: 250)
                    .padding(.horizontal)

                    if let stats = stats {
                        statsCard(stats: stats)
                    }
                }
            }
            .padding(.vertical)
        }
    }

    private func statsCard(stats: (min: Double, max: Double, avg: Double, change: Double)) -> some View {
        VStack(spacing: 12) {
            HStack(spacing: 20) {
                StatItem(label: "最小", value: "\(String(format: "%.1f", stats.min)) kg", color: .blue)
                StatItem(label: "最大", value: "\(String(format: "%.1f", stats.max)) kg", color: .red)
                StatItem(label: "平均", value: "\(String(format: "%.1f", stats.avg)) kg", color: .purple)
                StatItem(label: "変化", value: "\(String(format: "%+.1f", stats.change)) kg", color: stats.change >= 0 ? .red : .blue)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .padding(.horizontal)
    }
}

struct StatItem: View {
    let label: String
    let value: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundStyle(color)
        }
        .frame(maxWidth: .infinity)
    }
}

#Preview {
    BodyWeightChartView()
        .modelContainer(for: BodyWeightEntry.self, inMemory: true)
}
