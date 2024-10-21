DROP TABLE IF EXISTS Current_Patient;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Pharmacy;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS BillContainsMedicine;
DROP TABLE IF EXISTS Bill;
DROP TABLE IF EXISTS Medicine;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Doctor;
DROP TABLE IF EXISTS Clinic;
DROP TABLE IF EXISTS User;

CREATE TABLE User (
    Email VARCHAR(255) PRIMARY KEY,
    Password VARCHAR(255),
    Role CHAR(1)
);

CREATE TABLE Clinic (
    University_Name VARCHAR(255) UNIQUE,
    Clinic_ID INTEGER PRIMARY KEY AUTO_INCREMENT,
    Doctor_Availability BOOLEAN,
    Password VARCHAR(255)
);

CREATE TABLE Doctor (
    Name VARCHAR(255),
    Email VARCHAR(255) PRIMARY KEY,
    Specialization VARCHAR(255),
    Qualification VARCHAR(255),
    Age INTEGER,
    Clinic_ID INTEGER,
    FOREIGN KEY (Email) REFERENCES User(Email) ON DELETE CASCADE,
    FOREIGN KEY (Clinic_ID) REFERENCES Clinic(Clinic_ID) ON DELETE CASCADE
);

CREATE TABLE Patient (
    Email VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255),
    Age INTEGER,
    Gender BOOLEAN,
    Blood_Group VARCHAR(10),
    Clinic_ID INTEGER,
    Roll_number VARCHAR(255) UNIQUE,
    Address VARCHAR(255),
    FOREIGN KEY (Email) REFERENCES User(Email) ON DELETE CASCADE,
    FOREIGN KEY (Clinic_ID) REFERENCES Clinic(Clinic_ID) ON DELETE SET NULL
);

CREATE TABLE Medicine (
    Medicine_ID INTEGER PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255),
    Price FLOAT,
    Category VARCHAR(255),
    Type VARCHAR(255),
    Strength_and_Form VARCHAR(255)
);

CREATE TABLE Bill (
    Bill_ID INTEGER PRIMARY KEY AUTO_INCREMENT,
    Clinic_ID INTEGER,
    Patient_Email VARCHAR(255),
    Price DECIMAL(10, 2),
    Quantity INTEGER,
    Creation_date DATE,
    FOREIGN KEY (Clinic_ID) REFERENCES Clinic(Clinic_ID) ON DELETE CASCADE,
    FOREIGN KEY (Patient_Email) REFERENCES Patient(Email) ON DELETE CASCADE
);

CREATE TABLE BillContainsMedicine (
    Bill_ID INTEGER,
    Medicine_ID INTEGER,
    Quantity INTEGER,
    PRIMARY KEY (Bill_ID, Medicine_ID),
    FOREIGN KEY (Bill_ID) REFERENCES Bill(Bill_ID) ON DELETE CASCADE,
    FOREIGN KEY (Medicine_ID) REFERENCES Medicine(Medicine_ID) ON DELETE CASCADE
);

CREATE TABLE `Order` (
    Status VARCHAR(255),
    Bill_ID INTEGER PRIMARY KEY,
    OTP VARCHAR(60),
    Completion_time DATETIME,
    FOREIGN KEY (Bill_ID) REFERENCES Bill(Bill_ID) ON DELETE CASCADE
);

CREATE TABLE Pharmacy (
    Medicine_ID INTEGER,
    Clinic_ID INTEGER,
    Stock INTEGER,
    PRIMARY KEY (Medicine_ID, Clinic_ID),
    FOREIGN KEY (Medicine_ID) REFERENCES Medicine(Medicine_ID) ON DELETE CASCADE,
    FOREIGN KEY (Clinic_ID) REFERENCES Clinic(Clinic_ID) ON DELETE CASCADE
);

CREATE TABLE Feedback (
    Feedback_ID INTEGER PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255),
    Description VARCHAR(255),
    Category VARCHAR(255),
    Creation_date DATE,
    Clinic_ID INTEGER,
    FOREIGN KEY (Clinic_ID) REFERENCES Clinic(Clinic_ID) ON DELETE CASCADE
);

CREATE TABLE Current_Patient (
    Email VARCHAR(255),
    Queue_No INTEGER,
    Clinic_ID INTEGER,
    PRIMARY KEY (Email, Clinic_ID),
    FOREIGN KEY (Email) REFERENCES Patient(Email) ON DELETE CASCADE,
    FOREIGN KEY (Clinic_ID) REFERENCES Clinic(Clinic_ID) ON DELETE CASCADE
);
