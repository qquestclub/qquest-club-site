"""One error shape for the whole API (CONTRACT pinned convention):

    {"code": "SCREAMING_SNAKE", "message": "human readable", "details": {...}}

`details` appears only for validation errors (HTTP 400) and maps field names to problems.
"""
from rest_framework.response import Response
from rest_framework.views import exception_handler

ERROR_CODES = {
    400: "VALIDATION_ERROR",
    401: "NOT_AUTHENTICATED",
    403: "PERMISSION_DENIED",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    415: "UNSUPPORTED_MEDIA_TYPE",
    429: "THROTTLED",
}


def api_exception_handler(exc, context) -> Response | None:
    response = exception_handler(exc, context)
    if response is None:
        return None

    status = response.status_code
    code = ERROR_CODES.get(status, "ERROR")
    data = response.data

    if status == 400:
        body = {"code": code, "message": "The request was not valid.", "details": data}
    else:
        message = data.get("detail") if isinstance(data, dict) else data
        body = {"code": code, "message": str(message)}
    response.data = body
    return response
