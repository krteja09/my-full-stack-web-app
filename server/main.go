package main

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
	"time"
)


type Arrival struct {
	FirstArrivalTime  int `json:"first_arrival_time"`
	SecondArrivalTime int `json:"second_arrival_time"`
}
type Estimations struct {
	Name string `json:"name"`
	Arrival Arrival  `json:"arrivals"`
}

const NEXTBUSSERVICE = 15
const TimeBetweenStops = 2

func enableCORS(w *http.ResponseWriter)  {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Content-Type", "application/json")

}
func getEstimatedArrivals(c *gin.Context)  {
	estimatedTime := 0
	currentMinutes := time.Now().Minute()

	stopId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Println("Unable to get Id")
		log.Println(err.Error())
	}
	estimatedTime = getEstimationTime(currentMinutes, estimatedTime, stopId, TimeBetweenStops)
	UpdatedTimes := getEstimations(estimatedTime)
	//json.NewEncoder(w).Encode(UpdatedTimes)
	c.JSON(200, gin.H{
		"UpdatedTimes":UpdatedTimes,
	})
}

func getEstimations(estimatedTime int) []Estimations {
	var UpdatedTimes []Estimations

	firstArrival := checkForPreviousTrip(estimatedTime)
	secondArrival := firstArrival + NEXTBUSSERVICE
	UpdatedTimes = append(UpdatedTimes,  Estimations{
		Name:"Route 1",
		Arrival: Arrival{
			firstArrival,secondArrival},
	})

	firstArrival = checkForPreviousTrip(estimatedTime + 2)
	secondArrival = firstArrival + NEXTBUSSERVICE
	UpdatedTimes = append(UpdatedTimes,  Estimations{
		Name:"Route 2",
		Arrival: Arrival{
			firstArrival,secondArrival},
	})

	firstArrival = checkForPreviousTrip(estimatedTime + 4)
	secondArrival = firstArrival + NEXTBUSSERVICE
	UpdatedTimes = append(UpdatedTimes,  Estimations{
		Name:"Route 3",
		Arrival: Arrival{
			firstArrival,secondArrival},
	})
	return UpdatedTimes
}

func getEstimationTime(currentMinutes int, estimatedTime int, stopId int, TimeBetweenStops int) int {
	if currentMinutes >= 0 && currentMinutes < 15 {
		estimatedTime = (15 - currentMinutes) + ((stopId - 1) * TimeBetweenStops)
	}
	if currentMinutes >= 15 && currentMinutes < 30 {
		estimatedTime = (30 - currentMinutes) + ((stopId - 1) * TimeBetweenStops)
	}
	if currentMinutes >= 30 && currentMinutes < 45 {
		estimatedTime = (45 - currentMinutes) + ((stopId - 1) * TimeBetweenStops)
	}
	if currentMinutes >= 45 && currentMinutes <= 60 {
		estimatedTime = (60 - currentMinutes) + ((stopId - 1) * TimeBetweenStops)
	}
	return estimatedTime
}
func checkForPreviousTrip (minutes int) int{
	if minutes > NEXTBUSSERVICE {
		return minutes - NEXTBUSSERVICE
	}else if minutes == 0{
		return NEXTBUSSERVICE
	}
	return minutes
}

func main() {
	r := gin.Default()
	r.Use(static.Serve("/", static.LocalFile("./web", true)))
	api := r.Group("/api")
	api.GET("/getEstimatedArrivals/:id", getEstimatedArrivals)
	r.Run()
}

