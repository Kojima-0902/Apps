import Foundation
import SwiftData

@Model
final class BodyWeightEntry {
    var date: Date
    var weight: Double
    var note: String

    init(date: Date = Date(), weight: Double, note: String = "") {
        self.date = date
        self.weight = weight
        self.note = note
    }
}
