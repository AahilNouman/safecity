from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from sklearn.cluster import DBSCAN
from collections import Counter
from app.utils.metrics import calculate_radius

router = APIRouter(prefix="/cluster", tags=["clustering"])

class Point(BaseModel):
    lat: float
    lng: float
    category: str
    severity: float

class ClusterRequest(BaseModel):
    coordinates: List[Point]
    epsilon: float = 0.005
    min_samples: int = 3

class ClusterInfo(BaseModel):
    cluster_id: int
    centroid: Dict[str, float]
    incident_count: int
    primary_category: str
    avg_severity: float
    radius_meters: float
    categories: Dict[str, int]

class ClusterResponse(BaseModel):
    clusters: List[ClusterInfo]
    noise_count: int
    total_processed: int

@router.post("/", response_model=ClusterResponse)
async def create_clusters(request: ClusterRequest):
    if not request.coordinates:
        return ClusterResponse(clusters=[], noise_count=0, total_processed=0)
        
    try:
        coords = np.array([[p.lat, p.lng] for p in request.coordinates])
        coords_rad = np.radians(coords)
        
        # Earth radius in km
        earth_radius = 6371.0
        epsilon_rad = request.epsilon / earth_radius
        
        db = DBSCAN(eps=epsilon_rad, min_samples=request.min_samples, algorithm='ball_tree', metric='haversine')
        labels = db.fit_predict(coords_rad)
        
        clusters = []
        unique_labels = set(labels)
        noise_count = list(labels).count(-1)
        
        for k in unique_labels:
            if k == -1:
                continue
                
            class_member_mask = (labels == k)
            cluster_points = coords[class_member_mask]
            
            centroid_lat = float(np.mean(cluster_points[:, 0]))
            centroid_lng = float(np.mean(cluster_points[:, 1]))
            
            cluster_data = [p for i, p in enumerate(request.coordinates) if labels[i] == k]
            
            categories = [p.category for p in cluster_data]
            cat_counts = dict(Counter(categories))
            primary_category = max(cat_counts, key=cat_counts.get)
            
            avg_severity = float(np.mean([p.severity for p in cluster_data]))
            
            radius = calculate_radius(centroid_lat, centroid_lng, cluster_points)
            
            clusters.append(ClusterInfo(
                cluster_id=int(k),
                centroid={"lat": centroid_lat, "lng": centroid_lng},
                incident_count=len(cluster_data),
                primary_category=primary_category,
                avg_severity=avg_severity,
                radius_meters=radius,
                categories=cat_counts
            ))
            
        return ClusterResponse(
            clusters=clusters,
            noise_count=noise_count,
            total_processed=len(request.coordinates)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
