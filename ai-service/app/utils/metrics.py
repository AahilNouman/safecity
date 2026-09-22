import math
import numpy as np

def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371000  # radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)
    
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
        
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def calculate_radius(center_lat: float, center_lng: float, points: np.ndarray) -> float:
    if len(points) == 0:
        return 0.0
        
    max_dist = 0.0
    for p in points:
        dist = haversine_distance(center_lat, center_lng, p[0], p[1])
        if dist > max_dist:
            max_dist = dist
            
    return max_dist
