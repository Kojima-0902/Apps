import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            WorkoutListView()
                .tabItem {
                    Label("トレーニング", systemImage: "dumbbell.fill")
                }

            BodyWeightListView()
                .tabItem {
                    Label("体重", systemImage: "scalemass.fill")
                }

            ChartsView()
                .tabItem {
                    Label("グラフ", systemImage: "chart.line.uptrend.xyaxis")
                }
        }
        .tint(.orange)
    }
}

#Preview {
    ContentView()
        .modelContainer(for: [WorkoutSession.self, BodyWeightEntry.self], inMemory: true)
}
