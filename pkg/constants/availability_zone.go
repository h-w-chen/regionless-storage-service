package constants

type AvailabilityZone string

func (az AvailabilityZone) Name() string {
	return string(az)
}

const (
	US_EAST_1A AvailabilityZone = "us-east-1a"
	US_EAST_1B AvailabilityZone = "us-east-1b"
	US_EAST_1C AvailabilityZone = "us-east-1c"
	US_EAST_1D AvailabilityZone = "us-east-1d"
	US_EAST_1E AvailabilityZone = "us-east-1e"

	US_EAST_2A AvailabilityZone = "us-east-2a"
	US_EAST_2B AvailabilityZone = "us-east-2b"
	US_EAST_2C AvailabilityZone = "us-east-2c"

	US_WEST_1A AvailabilityZone = "us-west-1a"
	US_WEST_1B AvailabilityZone = "us-west-1b"
	US_WEST_1C AvailabilityZone = "us-west-1c"

	US_WEST_2A AvailabilityZone = "us-west-2a"
	US_WEST_2B AvailabilityZone = "us-west-2b"
	US_WEST_2C AvailabilityZone = "us-west-2c"

	DEFAULT_AZ AvailabilityZone = US_WEST_1A
)
