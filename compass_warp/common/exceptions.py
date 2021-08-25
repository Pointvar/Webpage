class InvalidInputException(Exception):
    def __init__(self, msg):
        self.msg = msg

    def __str__(self):
        return "InvalidInputException:%s" % (self.msg)
