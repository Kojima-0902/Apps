import SwiftUI

struct ChartsView: View {
    @State private var selectedTab = 0

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Picker("グラフ種類", selection: $selectedTab) {
                    Text("体重推移").tag(0)
                    Text("ボリューム").tag(1)
                    Text("種目別").tag(2)
                }
                .pickerStyle(.segmented)
                .padding()

                TabView(selection: $selectedTab) {
                    BodyWeightChartView()
                        .tag(0)

                    WorkoutVolumeChartView()
                        .tag(1)

                    ExerciseProgressChartView()
                        .tag(2)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
            }
            .navigationTitle("グラフ")
        }
    }
}

#Preview {
    ChartsView()
        .modelContainer(for: [WorkoutSession.self, BodyWeightEntry.self], inMemory: true)
}
