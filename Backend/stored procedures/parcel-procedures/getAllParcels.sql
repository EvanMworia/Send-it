CREATE or ALTER PROCEDURE GetAllParcels
    @SenderID UNIQUEIDENTIFIER = NULL,  -- Optional filter
    @ReceiverID UNIQUEIDENTIFIER = NULL,  -- Optional filter
    @Status NVARCHAR(50) = NULL  -- Optional filter
AS
BEGIN
    SET NOCOUNT ON;
    

    SELECT 
        ParcelID, SenderID, ReceiverID, SendingLocation, PickupLocation, 
        Status, CreatedAt, UpdatedAt
    FROM Parcels
    WHERE IsDeleted = 0  -- Exclude soft deleted parcels
        AND (@SenderID IS NULL OR SenderID = @SenderID)
        AND (@ReceiverID IS NULL OR ReceiverID = @ReceiverID)
        AND (@Status IS NULL OR Status = @Status)
    ORDER BY CreatedAt DESC;  -- Show newest first
END;


exec GetAllParcels @SenderID = '5A8127AC-7621-48BC-81F5-896D22BFE183'


INSERT INTO Users (FullName, Email, PasswordHash, ProfilePicture, Phone, Role)
VALUES 
    ('Alice Johnson', 'alice@example.com', 'hashedpassword1', 'alice.jpg', '1234567890', 'User'),
    ('Bob Smith', 'bob@example.com', 'hashedpassword2', 'bob.jpg', '0987654321', 'User'),
    ('Charlie Admin', 'charlie@example.com', 'hashedpassword3', 'charlie.jpg', '1122334455', 'Admin');


DECLARE @AliceID UNIQUEIDENTIFIER, @BobID UNIQUEIDENTIFIER, @CharlieID UNIQUEIDENTIFIER;

-- Get the user IDs
SELECT @AliceID = UserID FROM Users WHERE Email = 'alice@example.com';
SELECT @BobID = UserID FROM Users WHERE Email = 'bob@example.com';
SELECT @CharlieID = UserID FROM Users WHERE Email = 'charlie@example.com';

-- Insert parcels linked to users
INSERT INTO Parcels (SenderID, ReceiverID, SendingLocation, PickupLocation, Status)
VALUES 
    (@AliceID, @BobID, 'Nairobi', 'Mombasa', 'Pending'),
    (@BobID, @AliceID, 'Kisumu', 'Nairobi', 'In Transit'),
    (@CharlieID, @AliceID, 'Eldoret', 'Kisumu', 'Delivered');



select * from Users