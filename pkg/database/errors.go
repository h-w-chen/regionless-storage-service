package database

type DatabaseNotImplementedError struct {
	database string
}

func (nie *DatabaseNotImplementedError) Error() string {
	return nie.database + " not implemented"
}

type CreateDatabaseError struct{}

func (cre *CreateDatabaseError) Error() string {
	return "Failed to create database"
}
