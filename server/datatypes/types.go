package datatypes

import "time"

type Data struct {
	UserId    string      `bson:"userId"`
	Term      []string    `bson:"term,ommitempty"`
	Timestamp []time.Time `bson:"timestamp,ommitempty"`
}
