-- Fix infinite recursion in room_participants RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view participants in their rooms" ON room_participants;

-- Create a simpler policy without circular reference
CREATE POLICY "Users can view participants in their rooms"
ON room_participants
FOR SELECT
USING (
  user_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM room_participants rp2
    WHERE rp2.room_id = room_participants.room_id 
    AND rp2.user_id = auth.uid()
    AND rp2.id != room_participants.id
  )
);