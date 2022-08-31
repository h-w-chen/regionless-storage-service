package constants

type Region string

func (r Region) Name() string {
	return string(r)
}

const (
	US_EAST_1      Region = "us-east-1"
	US_EAST_2      Region = "us-east-2"
	US_WEST_1      Region = "us-west-1"
	US_WEST_2      Region = "us-west-2"
	DEFAULT_REGION Region = US_WEST_1
)
