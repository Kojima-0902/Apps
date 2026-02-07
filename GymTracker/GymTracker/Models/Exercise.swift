import Foundation

enum MuscleGroup: String, Codable, CaseIterable, Identifiable {
    case chest = "胸"
    case back = "背中"
    case shoulders = "肩"
    case arms = "腕"
    case legs = "脚"
    case abs = "腹筋"
    case fullBody = "全身"
    case cardio = "有酸素"
    case other = "その他"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .chest: return "figure.strengthtraining.traditional"
        case .back: return "figure.rowing"
        case .shoulders: return "figure.boxing"
        case .arms: return "figure.arms.open"
        case .legs: return "figure.walk"
        case .abs: return "figure.core.training"
        case .fullBody: return "figure.cross.training"
        case .cardio: return "figure.run"
        case .other: return "figure.mixed.cardio"
        }
    }
}

struct ExerciseTemplate: Identifiable, Codable, Hashable {
    var id = UUID()
    var name: String
    var muscleGroup: MuscleGroup

    static let defaults: [ExerciseTemplate] = [
        // 胸
        ExerciseTemplate(name: "ベンチプレス", muscleGroup: .chest),
        ExerciseTemplate(name: "ダンベルプレス", muscleGroup: .chest),
        ExerciseTemplate(name: "インクラインベンチプレス", muscleGroup: .chest),
        ExerciseTemplate(name: "チェストフライ", muscleGroup: .chest),
        ExerciseTemplate(name: "ディップス", muscleGroup: .chest),
        // 背中
        ExerciseTemplate(name: "デッドリフト", muscleGroup: .back),
        ExerciseTemplate(name: "ラットプルダウン", muscleGroup: .back),
        ExerciseTemplate(name: "ベントオーバーロウ", muscleGroup: .back),
        ExerciseTemplate(name: "チンニング（懸垂）", muscleGroup: .back),
        ExerciseTemplate(name: "シーテッドロウ", muscleGroup: .back),
        // 肩
        ExerciseTemplate(name: "ショルダープレス", muscleGroup: .shoulders),
        ExerciseTemplate(name: "サイドレイズ", muscleGroup: .shoulders),
        ExerciseTemplate(name: "フロントレイズ", muscleGroup: .shoulders),
        ExerciseTemplate(name: "リアデルトフライ", muscleGroup: .shoulders),
        // 腕
        ExerciseTemplate(name: "バーベルカール", muscleGroup: .arms),
        ExerciseTemplate(name: "ダンベルカール", muscleGroup: .arms),
        ExerciseTemplate(name: "トライセプスエクステンション", muscleGroup: .arms),
        ExerciseTemplate(name: "ハンマーカール", muscleGroup: .arms),
        // 脚
        ExerciseTemplate(name: "スクワット", muscleGroup: .legs),
        ExerciseTemplate(name: "レッグプレス", muscleGroup: .legs),
        ExerciseTemplate(name: "レッグカール", muscleGroup: .legs),
        ExerciseTemplate(name: "レッグエクステンション", muscleGroup: .legs),
        ExerciseTemplate(name: "カーフレイズ", muscleGroup: .legs),
        ExerciseTemplate(name: "ブルガリアンスクワット", muscleGroup: .legs),
        // 腹筋
        ExerciseTemplate(name: "クランチ", muscleGroup: .abs),
        ExerciseTemplate(name: "プランク", muscleGroup: .abs),
        ExerciseTemplate(name: "レッグレイズ", muscleGroup: .abs),
        ExerciseTemplate(name: "アブローラー", muscleGroup: .abs),
        // 有酸素
        ExerciseTemplate(name: "ランニング", muscleGroup: .cardio),
        ExerciseTemplate(name: "エアロバイク", muscleGroup: .cardio),
        ExerciseTemplate(name: "ローイング", muscleGroup: .cardio),
    ]
}
