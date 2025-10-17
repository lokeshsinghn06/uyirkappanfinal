from flask import current_app
from flask_socketio import join_room, emit
from app import socketio


@socketio.on('join_booking')
def on_join_booking(booking_id):
    join_room(booking_id)
    emit('status_changed', {'status': 'JOINED'}, room=booking_id)


@socketio.on('driver_location')
def on_driver_location(data):
    booking_id = data.get('bookingId')
    location = data.get('location')
    if not booking_id or not location:
        return
    current_app.mongo.pings.insert_one({
        'bookingId': booking_id,
        'location': location,
    })
    emit('location_update', {**location, 'ts': socketio.server.manager.get_server().eio.current_time()}, room=booking_id)


@socketio.on('booking_status')
def on_booking_status(data):
    booking_id = data.get('bookingId')
    status = data.get('status')
    if not booking_id or not status:
        return
    emit('status_changed', {'status': status}, room=booking_id)
