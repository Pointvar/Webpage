__string_list_schema = {"type": "array", "items": {"type": "string"}}


ajax_create_copy_task_schema = {
    "type": "object",
    "properties": {
        "copy_urls": __string_list_schema,
        "categray": {"type": "string"},
        "filter": {"type": "boolean"},
        "item_status": {"type": "string"},
        "item_detail": {"type": "string"},
    },
}
ajax_get_copy_complex_tasks_schema = {
    "type": "object",
    "properties": {},
}
