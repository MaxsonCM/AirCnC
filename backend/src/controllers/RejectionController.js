const Booking = require("../models/Booking")

module.exports = {
    async store(req, res) {
        const { booking_id } = req.params

        const booking = await Booking.findById(booking_id).populate('spot')

        if (!booking){
            return res.status(400).json({ error: "booking doesn't exists"})
        }
        if (booking.approved === true){
            return res.status(400).json({ error: 'booking already approved'})
        }
        if (booking.approved === false){
            return res.status(400).json({ error: 'booking already rejected'})
        }
        
        booking.approved = false
        await booking.save()

        const bookingUserSocket = req.connectedUsers[booking.user]

        if (bookingUserSocket){
            req.io.to(bookingUserSocket).emit('booking_response', booking)
        }

        return res.json(booking)
    }
}