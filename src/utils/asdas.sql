
DELIMITER $$
CREATE  PROCEDURE `LV_insertEventtoDatabase`
(
    IN `IdIn` int,
    IN `TenIn` VARCHAR(500),
    IN `DuongLichIn` tinyint(1),
    IN `NgayIn` INT,
    IN `ThangIn` INT,
    IN `NamIn` INT,
    IN `ToDayIn` INT, 
    IN `ToMonthIn` INT,
    IN `ToYearIn` INT, 
    IN `ChiTietIn` text,
    IN `GioBatDauIn` VARCHAR(10),
    IN `GioKetThucIn` VARCHAR(10),
    IN `HandleRepeaIn` tinyint(1),
    IN `RemindIn` INT,
    IN `Id_type_eventIn` INT,
    IN `Id_UserIn` INT,
)


    ThangIn INT,
    NamIn INT,
    ToDayIn INT, 
    ToMonthIn INT,
    ToYearIn INT, 
    ChiTietIn text,
    GioBatDauIn VARCHAR(10),
    GioKetThucIn VARCHAR(10),
    HandleRepeaIn tinyint(1),
    RemindIn INT,
    Id_type_eventIn INT,
    Id_UserIn INT,
Begin
		If IdIn = 0 THEN
            Begin 
                Insert into canchi (Ten, Menh, NguHanh, NghiaNguHanh, Id_Can, Id_Chi, CreateBy)
                Select  A.TenIn, A.MenhIn, A.NguHanhIn, A.NghiaNguHanhIn, A.CanIn, A.ChiIn, A.CreateBy
                From ( Select IdIn, TenIn, MenhIn, NguHanhIn, NghiaNguHanhIn, CanIn, ChiIn, CreateBy) As A
                Left Join canchi B On A.IdIn = B.Id and B.State = 0
                Where B.Id is null;
                
                Insert into user_event (Ten, Ngay, Thang, Nam, GioBatDau, GioKetThuc, ChiTiet, HandleRepeat, Remind, DuongLich, ToDay, ToMonth, ToYear, Id_type_event, Id_User) 
                Values (TenIn, NgayIn, ThangIn, Nam, GioBatDau, GioKetThucIn, ChiTietIn, HandleRepeat, RemindIn, DuongLichIn, ToDayIn, ToMonthIn, ToYearIn, Id_type_eventIn, Id_UserIn);
            End;
         ELSE 
             Begin 
				IF (SELECT get_permission(CreateBy,3) = 0)
                    Then BEGIN 
                        UPDATE canchi 
                        SET 
                        canchi.Ten = TenIn,
                        canchi.Menh = MenhIn,
                        canchi.NguHanh = NguHanhIn,
                        canchi.NghiaNguHanh = NghiaNguHanhIn,
                        canchi.Id_Can = CanIn,
                        canchi.Id_Chi = ChiIn,
                        canchi.EditAt = Now(),
                        canchi.EditBy = CreateBy
                        WHERE IdIn = canchi.Id and canchi.State = 0 ;
                  End;
                 Else Select "Bạn không có quyền chỉnh sửa! Vui lòng liên hệ admin để được cấp quyền" as message;
                 END IF;
             End;
        END IF;
	 
End$$
DELIMITER ;




drop PROCEDURE LV_insertEventtoDatabase;
DELIMITER $$
CREATE  PROCEDURE `LV_insertEventtoDatabase`
(
    IN `Json` text,
    OUT `ReturnMess` text
)
Begin
	DECLARE i INT DEFAULT 0;
    DECLARE total INT;
	DROP TEMPORARY TABLE IF EXISTS Tamp_LV_insertEventtoDatabase;
	CREATE TEMPORARY TABLE Tamp_LV_insertEventtoDatabase (
    	IdIn int,
        TenIn VARCHAR(500),
    	NgayIn int,
    	ThangIn int
    );
        
  	SET total = JSON_LENGTH(json);
    select total;
    WHILE i < total DO
      	INSERT into Tamp_LV_insertEventtoDatabase (IdIn, TenIn, NgayIn, ThangIn)
        SELECT A.Id, A.Ten, A.Ngay, A.Thang
        FROM 
        (
        	SELECT 
            	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Id'))) as Id,
            	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Ten'))) as Ten,
            	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Ngay'))) as Ngay,
            	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Thang'))) as Thang
        )A;
        SET i = i + 1;
    END WHILE; 
    
    SELECT CONCAT('[', 
        GROUP_CONCAT(
            JSON_OBJECT(
                'IdIn', IdIn,
                'TenIn', TenIn,
                'NgayIn', NgayIn,
                'ThangIn', ThangIn
            )
        ), 
    ']') INTO ReturnMess
    FROM Tamp_LV_insertEventtoDatabase;
    
    IF ReturnMess IS NULL THEN
        SET ReturnMess = '[]';
    END IF;
End$$
DELIMITER ;

 SELECT CONCAT(
        GROUP_CONCAT(
            JSON_OBJECT(
                'IdIn', IdIn,
                'TenIn', TenIn,
                'NgayIn', NgayIn,
                'ThangIn', ThangIn
            )
        ) 
    ) INTO ReturnMess
    FROM Tamp_LV_insertEventtoDatabase;



    DELIMITER $$
CREATE  PROCEDURE `LV_insertEventtoDatabase`
(
    IN `Json` text,
    OUT `ReturnMess` text
)
Begin
	DECLARE i INT DEFAULT 0;
    DECLARE total INT;
	DROP TEMPORARY TABLE IF EXISTS Tamp_LV_insertEventtoDatabase;
	CREATE TEMPORARY TABLE Tamp_LV_insertEventtoDatabase (
    	IdIn int,
        TenIn VARCHAR(500),
        DuongLichIn tinyint(1),
    	NgayIn INT,
    	ThangIn INT,
    	NamIn INT,
    	ToDayIn INT, 
    	ToMonthIn INT,
    	ToYearIn INT, 
    	ChiTietIn text,
    	GioBatDauIn VARCHAR(10),
    	GioKetThucIn VARCHAR(10),
    	HandleRepeaIn tinyint(1),
    	RemindIn INT,
    	Id_type_eventIn INT,
    	Id_UserIn INT,
    );
    
    INSERT into Tamp_LV_insertEventtoDatabase 
    (IdIn, TenIn, DuongLichIn, ChiTietIn, NgayIn, ThangIn, NamIn, ToDayIn, ToMonthIn, ToYearIn, GioBatDauIn, GioKetThucIn, HandleRepeaIn, RemindIn, Id_type_eventIn, Id_UserIn)
   	SELECT A.Id, A.Ten, A.DuongLich, A.ChiTiet, A.Ngay, A.Thang, A.Nam, A.ToDay, A.ToMonth, A.ToYear, A.GioBatDau, A.GioKetThuc,  A.HandleRepeat, A.Remind, A.Id_type_event, A.Id_User
   	FROM 
   	(
   		SELECT 
          	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Id'))) as Id,
          	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Ten'))) as Ten,
          	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].DuongLich'))) as DuongLich,
          	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].ChiTiet'))) as ChiTiet,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Ngay'))) as Ngay,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Thang'))) as Thang,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Nam'))) as Nam,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].ToDay'))) as ToDay,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].ToMonth'))) as ToMonth,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].ToYear'))) as ToYear,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Thang'))) as Thang,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].GioBatDau'))) as GioBatDau,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].GioKetThuc'))) as GioKetThuc,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].HandleRepeat'))) as HandleRepeat,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Remind'))) as Remind,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Remind'))) as Remind,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Id_type_event'))) as Id_type_event,
        	JSON_UNQUOTE(JSON_EXTRACT(Json, CONCAT('$[', i, '].Id_User'))) as Id_User
   	)A;
    
    IF 
    
End$$
DELIMITER ;