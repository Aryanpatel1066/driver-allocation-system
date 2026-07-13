const { redis } = require("../config/redis");

async function assignRide(rideId, driverId) {
  const script = `
    local status = redis.call('HGET', KEYS[1], 'status')
    local assigned = redis.call('HGET', KEYS[1], 'assignedDriver')

    if status ~= 'SEARCHING' then
        return 'TIMEOUT'
    end

    if assigned == false or assigned == '' then
        redis.call('HSET', KEYS[1], 'assignedDriver', ARGV[1])
        redis.call('HSET', KEYS[1], 'status', 'ASSIGNED')
        return 'SUCCESS'
    end

    if assigned == ARGV[1] then
        return 'ALREADY_ASSIGNED_SELF'
    end

    return assigned
  `;

  const result = await redis.eval(script, {
    keys: [`ride:${rideId}`],
    arguments: [driverId],
  });

  if (result === "SUCCESS") {
    return {
      status: "SUCCESS",
    };
  }

  if (result === "TIMEOUT") {
    return {
      status: "TIMEOUT",
    };
  }

  if (result === "ALREADY_ASSIGNED_SELF") {
    return {
      status: "ALREADY_ASSIGNED_SELF",
    };
  }

  return {
    status: "ALREADY_ASSIGNED_OTHER",
    driverId: result,
  };
}

module.exports = {
  assignRide,
};