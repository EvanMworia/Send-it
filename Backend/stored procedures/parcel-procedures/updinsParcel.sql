
USE SENDITDB
GO
CREATE OR ALTER  PROCEDURE UpdinsParcel( 
    @ParcelID VARCHAR(255) = NULL,  -- NULL when creating a new parcel
    @SenderEmail VARCHAR(255) = NULL,  -- Optional filter
    @ReceiverEmail VARCHAR(255) = NULL,
    @SendingLocation VARCHAR(255) = NULL,
    @PickupLocation VARCHAR(255) = NULL,
    @Status VARCHAR(50) = 'Pending')  -- Default status)
AS
BEGIN
	IF EXISTS(SELECT 1 FROM Parcels WHERE ParcelID=@ParcelID)
	BEGIN 
	-- Update status of an existing parcel
        UPDATE Parcels
        SET Status = @Status,
            UpdatedAt = GETDATE()
        WHERE ParcelID = @ParcelID;

        PRINT ('Parcel status updated for ID');
	END
	ELSE
	BEGIN
	INSERT INTO Parcels (ParcelID, SenderEmail, ReceiverEmail, SendingLocation, PickupLocation, Status, CreatedAt, UpdatedAt)
        VALUES (@ParcelID, @SenderEmail, @ReceiverEmail, @SendingLocation, @PickupLocation, @Status, GETDATE(), GETDATE());

        PRINT ('New parcel created');
	END
 
END


EXEC UpdinsParcel @ParcelID = 'TestId',@SenderEmail = 'jennifer.o.akinyi@gmail.com',@ReceiverEmail = 'evannji99@gmail.com',@SendingLocation ='Nairobi',@PickupLocation= 'Mombasa',@Status = 'Delivered'