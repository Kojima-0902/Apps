import Foundation
import SwiftData

@Model
final class ExerciseSet {
    var exerciseName: String
    var muscleGroupRaw: String
    var setNumber: Int
    var weight: Double
    var reps: Int
    var note: String
    var timestamp: Date

    @Relationship(inverse: \WorkoutSession.exercises)
    var session: WorkoutSession?

    var muscleGroup: MuscleGroup {
        get { MuscleGroup(rawValue: muscleGroupRaw) ?? .other }
        set { muscleGroupRaw = newValue.rawValue }
    }

    var volume: Double {
        weight * Double(reps)
    }

    init(
        exerciseName: String,
        muscleGroup: MuscleGroup,
        setNumber: Int,
        weight: Double,
        reps: Int,
        note: String = "",
        timestamp: Date = Date()
    ) {
        self.exerciseName = exerciseName
        self.muscleGroupRaw = muscleGroup.rawValue
        self.setNumber = setNumber
        self.weight = weight
        self.reps = reps
        self.note = note
        self.timestamp = timestamp
    }
}
