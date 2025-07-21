-- Add plant_quantity column to quiz_responses table
ALTER TABLE public.quiz_responses 
ADD COLUMN plant_quantity TEXT;

-- Create the enum type for plant quantity
CREATE TYPE plant_quantity_type AS ENUM ('1-4', '5-20', '21-100', '101-500', '500+');

-- Update the column to use the enum type
ALTER TABLE public.quiz_responses 
ALTER COLUMN plant_quantity TYPE plant_quantity_type USING plant_quantity::plant_quantity_type;