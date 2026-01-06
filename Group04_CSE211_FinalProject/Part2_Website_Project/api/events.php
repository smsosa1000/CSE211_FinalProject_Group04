<?php
// المسار: /htdocs/api/events.php

// 1. استدعاء ملف الاتصال المركزي
require_once 'db_connect.php';

// 2. إعداد استجابة JSON (يجب أن يكون أول شيء يتم إرساله)
header('Content-Type: application/json; charset=UTF-8');

try {
    // محاولة الاتصال بقاعدة البيانات
    $pdo = getDBConnection();
    
    // 3. جلب البيانات من جدول الفعاليات
    $stmt = $pdo->query("SELECT id, name, category, date, location, cost, image FROM events ORDER BY id DESC");

    if (!$stmt) {
        throw new Exception("فشل تنفيذ الاستعلام");
    }

    $events = $stmt->fetchAll(PDO::FETCH_ASSOC); // FETCH_ASSOC لضمان تنسيف نظيف للـ JSON

    // خريطة أسماء الصور الصحيحة (تصحيح أسماء الملفات)
    $imageMap = [
        1 => 'event1_salt_pepper_supper_club.jpeg',
        2 => 'event2_spiritus_natalis.jpeg',
        3 => 'event3_carrossel_veneziano.jpeg',
        4 => 'event4_Diverlândia.jpg',
        5 => 'event5_carmen_miranda.jpg',
        6 => 'event6_jonas_lander.jpg',
        7 => 'event7_ano_novo_no_lux.jpg',
        8 => 'event8_the_great_mona.jpeg',
        9 => 'event9_concerto_de_ano_novo.jpeg',
        10 => 'event10_queen_sheeks_jamaican_popup.avif',
        11 => 'event11_diverlandia_2.jpg',
        12 => 'event12_carmen_miranda_2.jpg',
        13 => 'event13_Jonas_Lander.jpg',
        14 => 'event14_ano_novo_no_lux2.jpg',
        15 => 'event15_spanish_beginner_course.png',
        16 => 'event16_italian_beginner_course_a1.jpg',
        17 => 'event17_burns_night.webp',
        18 => 'event18_bottomless_afternoon_tea.jpg',
        19 => 'event19_pizza_making_class.jpeg',
        20 => 'event20_plant_based_food_fest.jpg',
        21 => 'event21_shanghai_lounge.jpeg'
    ];

    // تصحيح أسماء الصور لكل فعالية
    foreach ($events as &$event) {
        $id = (int)$event['id'];
        if (isset($imageMap[$id])) {
            $event['image'] = $imageMap[$id];
        }
    }
    unset($event); // مهم لتجنب مشاكل المراجع

    // 4. إرسال البيانات النهائية فقط (لا تضع أي echo قبل هذا السطر)
    echo json_encode([
        'ok' => true,
        'events' => $events
    ]);

} catch (Exception $e) {
    // في حالة حدوث خطأ
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'خطأ في السيرفر: ' . $e->getMessage()
    ]);
}
?>