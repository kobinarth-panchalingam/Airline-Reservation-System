export const responseFormatter = (req, res, next) => {
    const originalSend = res.send

    res.send = function (body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            // Success response
            body = {
                success: true,
                data: JSON.parse(body)
            }
        } else {
            // Error response
            body = {
                success: false,
                error: JSON.parse(body)
            }
        }

        originalSend.call(this, JSON.stringify(body))
    }

    next()
}
