USE SENDITDB
GO
CREATE OR ALTER PROCEDURE UpsertParcel
    @ParcelID VARCHAR(255) = NULL,  -- NULL when creating a new parcel
    @SenderEmail VARCHAR(255) = NULL,  -- Optional filter
    @ReceiverEmail VARCHAR(255) = NULL,
    @SendingLocation VARCHAR(255) = NULL,
    @PickupLocation VARCHAR(255) = NULL,
    @Status VARCHAR(50) = 'Pending'  -- Default status
AS
BEGIN
    SET NOCOUNT ON;

    -- If ParcelID is NULL, insert a new parcel
    IF @ParcelID IS NULL
    BEGIN
        

        INSERT INTO Parcels (ParcelID, SenderEmail, ReceiverEmail, SendingLocation, PickupLocation, Status, CreatedAt, UpdatedAt)
        VALUES (@ParcelID, @SenderEmail, @ReceiverEmail, @SendingLocation, @PickupLocation, @Status, GETDATE(), GETDATE());

        PRINT ('New parcel created');
    END
    ELSE
    BEGIN
        -- Update status of an existing parcel
        UPDATE Parcels
        SET Status = @Status,
            UpdatedAt = GETDATE()
        WHERE ParcelID = @ParcelID;

        PRINT ('Parcel status updated for ID');
    END
END;


EXEC UpsertParcel @ParcelID = 'TestId',@SenderEmail = 'jennifer.o.akinyi@gmail.com',@ReceiverEmail = 'evannji99@gmail.com',@SendingLocation = NULL,@PickupLocation= NULL,@Status = 'Pending'