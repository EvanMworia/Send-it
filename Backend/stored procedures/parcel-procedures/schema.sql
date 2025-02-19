CREATE TABLE Users (
    UserID VARCHAR(255) PRIMARY KEY,
    FullName VARCHAR(100),
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    ProfilePicture VARCHAR(255),
    Phone VARCHAR(20),
    Role VARCHAR(10) CHECK (Role IN ('User', 'Admin')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsDeleted BIT DEFAULT 0
);

CREATE TABLE Parcels (
    ParcelID VARCHAR(255) PRIMARY KEY,
	SenderEmail VARCHAR(255) FOREIGN KEY REFERENCES Users(Email),
	ReceiverEmail VARCHAR(255) FOREIGN KEY REFERENCES Users(Email),
    ReceiverPhone VARCHAR(255),
    SendingLocation VARCHAR(255),
    PickupLocation VARCHAR(255),
    Status VARCHAR(50) CHECK (Status IN ('Pending', 'In-Transit', 'Delivered', 'Picked')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    IsDeleted BIT DEFAULT 0
);

INSERT INTO Parcels (ParcelID, SenderEmail, ReceiverEmail, SendingLocation, PickupLocation, Status)
VALUES
('P001', 'ivonnenabangala@gmail.com', 'evannji99@gmail.com', 'Nairobi', 'Mombasa', 'Pending'),
('P002', 'evannji99@gmail.com', 'ivonnenabangala@gmail.com', 'Kisumu', 'Nakuru', 'In-Transit'),
('P003', 'Test1@example1.com', 'ivonnenabangala@gmail.com', 'Eldoret', 'Thika', 'Delivered');