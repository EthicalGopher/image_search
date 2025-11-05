package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/EthicalGopher/image_search/datatypes"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var client *mongo.Client
var db *mongo.Collection

func Connect() {
	uri := os.Getenv("MONGODB_URI")
	var err error
	client, err = mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	if err := client.Ping(context.TODO(), nil); err != nil {
		panic(err)
	}

	db = client.Database("image_search").Collection("user")
	fmt.Println("Connection Successfull")
}

func Disconnect() {
	if err := client.Disconnect(context.TODO()); err != nil {
		panic(err)
	}
}

func FindData(userId string) (datatypes.Data, error) {
	log.Println("--- FindData function called ---")
	log.Println("userId:", userId)
	var result datatypes.Data
	err := db.FindOne(context.TODO(), bson.D{{"userId", userId}}).Decode(&result)
	if err == mongo.ErrNoDocuments {
		log.Println("No document found for userId:", userId)
		return datatypes.Data{}, fmt.Errorf("no data was found for userid : %s", userId)
	}
	if err != nil {
		log.Println("Error finding document:", err)
		return datatypes.Data{}, err
	}
	log.Println("Found document for userId:", userId)
	return result, nil
}
func EnterData(userId string, term string) error {
	log.Println("--- EnterData function called ---")
	log.Println("userId:", userId, "term:", term)
	currentTime := time.Now()
	result, err := FindData(userId)
	if err != nil {
		if err.Error() == fmt.Sprintf("no data was found for userid : %s", userId) {
			log.Println("No data found for userId, creating new document")
			newData := datatypes.Data{
				UserId:    userId,
				Term:      []string{term},
				Timestamp: []time.Time{currentTime},
			}
			_, err := db.InsertOne(context.TODO(), newData)
			if err != nil {
				log.Println("Failed to insert new data:", err)
				return fmt.Errorf("failed to insert new data: %w", err)
			}
			log.Println("New data inserted successfully")
			return nil
		}
		log.Println("Failed to find data:", err)
		return fmt.Errorf("failed to find data: %w", err)
	}

	log.Println("Found existing data for userId, updating document")
	result.Term = append(result.Term, term)
	result.Timestamp = append(result.Timestamp, currentTime)

	filter := bson.D{{"userId", userId}}
	update := bson.D{{"$set", bson.D{{"term", result.Term}, {"timestamp", result.Timestamp}}}}

	_, err = db.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Println("Failed to update data:", err)
		return fmt.Errorf("failed to update data: %w", err)
	}

	log.Println("Data updated successfully")
	return nil
}

func TopHistory() ([]string, error) {
	pipeline := mongo.Pipeline{
		{{Key: "$unwind", Value: "$term"}},
		{{Key: "$group", Value: bson.D{{Key: "_id", Value: "$term"}, {Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}}}}},
		{{Key: "$sort", Value: bson.D{{Key: "count", Value: -1}}}},
		{{Key: "$limit", Value: 5}},
		{{Key: "$project", Value: bson.D{{Key: "_id", Value: 0}, {Key: "term", Value: "$_id"}}}},
	}
	cursor, err := db.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []struct {
		Term string `bson:"term"`
	}
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	var topTerms []string
	for _, result := range results {
		topTerms = append(topTerms, result.Term)
	}

	return topTerms, nil

}
func ClearHistory(userId string) error {
	log.Println("--- ClearHistory function called ---")
	log.Println("userId:", userId)

	filter := bson.D{{"userId", userId}}
	update := bson.D{{"$set", bson.D{{"term", []string{}}, {"timestamp", []time.Time{}}}}}

	_, err := db.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Println("Failed to clear history:", err)
		return fmt.Errorf("failed to clear history: %w", err)
	}

	log.Println("History cleared successfully")
	return nil
}
