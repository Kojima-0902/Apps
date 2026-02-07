import Foundation
import SwiftData

@Model
final class WorkoutSession {
    var date: Date
    var note: String
    var durationMinutes: Int

    @Relationship(deleteRule: .cascade)
    var exercises: [ExerciseSet] = []

    var totalVolume: Double {
        exercises.reduce(0) { $0 + $1.volume }
    }

    var muscleGroups: [MuscleGroup] {
        let groups = Set(exercises.map { $0.muscleGroup })
        return Array(groups).sorted { $0.rawValue < $1.rawValue }
    }

    var exerciseNames: [String] {
        let names = Set(exercises.map { $0.exerciseName })
        return Array(names).sorted()
    }

    init(date: Date = Date(), note: String = "", durationMinutes: Int = 0) {
        self.date = date
        self.note = note
        self.durationMinutes = durationMinutes
    }
}
