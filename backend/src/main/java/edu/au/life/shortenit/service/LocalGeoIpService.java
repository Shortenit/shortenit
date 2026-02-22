package edu.au.life.shortenit.service;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import com.maxmind.geoip2.model.CityResponse;
import edu.au.life.shortenit.dto.GeoLocation;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;

@Service
@Slf4j
@RequiredArgsConstructor
public class LocalGeoIpService {
    private DatabaseReader databaseReader;

    @Value("${geoip.database.path}")
    private String databasePath;

    private final ResourceLoader resourceLoader;

    @PostConstruct
    public void init() {
        try {
            log.info("Loading GeoIP database from : {}", databasePath);
            Resource resource = resourceLoader.getResource(databasePath);
            InputStream inputStream = resource.getInputStream();

            // Create database reader
            databaseReader = new DatabaseReader.Builder(inputStream).build();

            log.info("GeoIP database loaded successfully");
        } catch (IOException e) {
            log.error("Failed to load GeoIP database from path : {}. Error: {}",
                    databasePath, e.getMessage());
            log.error("Geographic data will reutrn 'Unknown' for all requests");
        }
    }

    @PreDestroy
    public void cleanup() {
        if (databaseReader != null) {
            try {
                databaseReader.close();
                log.info("GeoIP database closed successfully");
            } catch (IOException e) {
                log.error("Error closing GeoIP database", e);
            }
        }
    }

    public GeoLocation getLocation(String ipAddress) {
        // handle null or empty ip
        if (ipAddress == null || ipAddress.trim().isEmpty()) {
            return new GeoLocation("Unknown", "Unknown");
        }

        // handle localhost and private ips
        if (isLocalOrPrivateIp(ipAddress)) {
            log.debug("Local or private IP detected: {} ", ipAddress);
            return new GeoLocation("Unknown", "Unknown");
        }

        // database not loaded
        if (databaseReader == null) {
            log.debug("Database reader not initialized, returning Unknown");
            return new GeoLocation("Unknown", "Unknown");
        }

        try {
            // convert ip string to InetAddress
            InetAddress inetAddress = InetAddress.getByName(ipAddress);

            // Query the database
            CityResponse response = databaseReader.city(inetAddress);

            String country = response.getCountry().getName();
            String city = response.getCity().getName();

            // Handle nulls
            country = (country != null) ? country : "Unknown";
            city = (city != null) ? city : "Unknown";

            log.debug("Resolved IP {} to: {} - {}", ipAddress, country, city);
            return new GeoLocation(country, city);
        } catch (GeoIp2Exception e) {
            log.warn("IP address not found in database: {}", ipAddress);
            return new GeoLocation("Unknown", "Unknown");
        } catch (IOException e) {
            log.error("Error querying GeoIP database for IP: {}", ipAddress, e);
            return new GeoLocation("Unknown", "Unknown");
        } catch (Exception e) {
            log.error("Unexpected error getting location for IP: {}", ipAddress, e);
            return new GeoLocation("Unknown", "Unknown");
        }
    }

    private boolean isLocalOrPrivateIp(String ip) {
        return ip.equals("127.0.0.1")
                || ip.equals("::1")
                || ip.equals("0:0:0:0:0:0:0:1")
                || ip.startsWith("192.168.")
                || ip.startsWith("10.")
                || ip.startsWith("172.16.")
                || ip.startsWith("172.17.")
                || ip.startsWith("172.18.")
                || ip.startsWith("172.19.")
                || ip.startsWith("172.20.")
                || ip.startsWith("172.21.")
                || ip.startsWith("172.22.")
                || ip.startsWith("172.23.")
                || ip.startsWith("172.24.")
                || ip.startsWith("172.25.")
                || ip.startsWith("172.26.")
                || ip.startsWith("172.27.")
                || ip.startsWith("172.28.")
                || ip.startsWith("172.29.")
                || ip.startsWith("172.30.")
                || ip.startsWith("172.31.");
    }


}
